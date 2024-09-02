import React, { useEffect, useState } from 'react'
import { Alert, Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Typography, Button } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../utils/config';

const SelectUniverse = ({ selectedUniverse, setSelectedUniverse, setTicker, setExchange, handleAnalyze }) => {
  const [universes, setUniverses] = useState([]);
  const [universe_tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const fetchUniverses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/universes`);
        setUniverses(response.data);
      } catch (err) {
        setError('Failed to fetch universes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUniverses();
  }, []);

  const handleUniverseChange = (event) => {
    const selectedUniverseId = event.target.value;
    setSelectedUniverse(selectedUniverseId);

    const universe = universes.find((u) => u.id === selectedUniverseId);
    const parsedData = JSON.parse(universe.tickers).tickers;

    if (parsedData) {
      setTickers(parsedData);
    } else {
      setTickers([]);
    }
  };

  const onClickTicker = (e, ticker) => {
    setTicker(ticker.ticker)
    setExchange(ticker.exchange)
    setIsClicked(true)
  }

  useEffect(() => {
    if (isClicked) {
      handleAnalyze();
      setIsClicked(false);
    }
  }, [isClicked]);

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, height: 'auto', minHeight: '640px' }}>
      <Typography variant="h5" gutterBottom>
        Select Universe
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
            <InputLabel>Universe</InputLabel>
            <Select
              value={selectedUniverse || ''}
              onChange={handleUniverseChange}
              label="Universe"
            >
              {universes.map((universe) => (
                <MenuItem key={universe.id} value={universe.id}>
                  {universe.source} {universe.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {universe_tickers.length > 0 && (
            <Box
              sx={{
                maxHeight: '470px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: 2,
              }}
            >
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {universe_tickers.map((ticker, index) => (
                  <li
                    className='ticker-card'
                    onClick={(e) => onClickTicker(e, ticker)}
                    key={index}
                    style={{ marginBottom: '10px', cursor: 'pointer' }}
                  >
                    {ticker.exchange}:<strong>{ticker.ticker}</strong>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" sx={{ marginTop: 2 }}>
            <Button disabled={loading} variant="contained" color="secondary" sx={{ width: '30%' }}>
              Universe Chat
            </Button>
            <Button disabled={loading} variant="contained" color="secondary" sx={{ width: '30%' }}>
              Universe Volatility
            </Button>
            <Button disabled={loading} variant="contained" color="secondary" sx={{ width: '30%' }}>
              Insider Buyers
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SelectUniverse;
