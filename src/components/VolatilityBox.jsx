import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Paper, Select, MenuItem, FormControl, InputLabel, Button, TextField } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../utils/config';

function VolatilityBox() {
  const [ticker, setTicker] = useState('SPY');
  const [interval, setInterval] = useState('1d');
  const [period, setPeriod] = useState('5d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateVolatilityData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${baseUrl}/ticker-volatility`, { ticker, period, interval });
      setData(res.data);
    } catch (e) {
      setError('Failed to fetch volatility data.');
      console.error('Failed to fetch volatility data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateVolatilityData();
  }, []);

  const handleTickerChange = (e) => {
    setTicker(e.target.value);
    setData(null);
  };

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
    setData(null);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    setData(null);
  };

  return (
    <Paper style={{ padding: 8, margin: '8px 0' }}>
      <Typography variant="h6" gutterBottom>
        Volatility
      </Typography>
      
      <Box mb={1} display="flex" flexDirection="column" gap={1}>
        <Box display="flex" gap={1}>
          <FormControl variant="outlined" size="small" margin="dense" sx={{ flex: 1 }}>
            <TextField
              label="Ticker"
              value={ticker}
              onChange={handleTickerChange}
              variant="outlined"
              size="small"
            />
          </FormControl>

          <FormControl variant="outlined" size="small" margin="dense" sx={{ flex: 1 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              onChange={handlePeriodChange}
              label="Period"
            >
              <MenuItem value="5d">5 Days</MenuItem>
              <MenuItem value="1mo">1 Month</MenuItem>
              <MenuItem value="3mo">3 Months</MenuItem>
              <MenuItem value="1y">1 Year</MenuItem>
              {/* Add more options as needed */}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" margin="dense" sx={{ flex: 1 }}>
            <InputLabel>Interval</InputLabel>
            <Select
              value={interval}
              onChange={handleIntervalChange}
              label="Interval"
            >
              <MenuItem value="15m">15 Minutes</MenuItem>
              <MenuItem value="1h">1 Hour</MenuItem>
              <MenuItem value="1d">1 Day</MenuItem>
              <MenuItem value="1mo">1 Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Button variant="contained" color="primary" onClick={updateVolatilityData} size="small">
          Update
        </Button>
      </Box>
      
      {loading && <CircularProgress size={24} />}
      
      {error && <Typography color="error">{error}</Typography>}
      
      {data && (
        <Box mt={1}>
          {data.change_summary.num_positive_changes !== undefined && (
            <Typography variant="body2" sx={{ color: 'green', textAlign:'center' }}>
              {`Num: ${data.change_summary.num_positive_changes}  Avg: ${data.change_summary.avg_positive_change}%  Max: ${data.change_summary.max_positive_change}%`}
            </Typography>
          )}
          {data.change_summary.num_negative_changes !== undefined && (
            <Typography variant="body2" sx={{ color: 'red', textAlign:'center' }}>
              {`Num: ${data.change_summary.num_negative_changes}  Avg: ${data.change_summary.avg_negative_change}%  Max: ${data.change_summary.max_negative_change}%`}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default VolatilityBox;