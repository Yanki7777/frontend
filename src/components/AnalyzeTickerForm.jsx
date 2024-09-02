import { Box, Button, CircularProgress, Paper, TextField, Typography, Grid } from '@mui/material';
import React, { useState } from 'react';
import VolatilityAnalysis from './VolatilityAnalysis';
const AnalyzeTickerForm = ({
  ticker, setTicker,
  exchange, setExchange,
  screener, setScreener,
  tickerInterval1, setTickerInterval1,
  tickerInterval2, setTickerInterval2,
  loading, handleAnalyze, error,
  showTickerMenu
}) => {
  
  const [showVolatilityChart, setShowVolatilityChart] = useState(false); // State to control the rendering of VolatilityChart
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAnalyze();    
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Analyze Ticker
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              error={!!error && !ticker.trim()}
              helperText={!!error && !ticker.trim() ? 'Ticker is required' : ''}
              disabled={loading}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Exchange"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              disabled={loading}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Screener"
              value={screener}
              onChange={(e) => setScreener(e.target.value)}
              disabled={loading}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Interval 1"
              value={tickerInterval1}
              onChange={(e) => setTickerInterval1(e.target.value)}
              disabled={loading}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Interval 2"
              value={tickerInterval2}
              onChange={(e) => setTickerInterval2(e.target.value)}
              disabled={loading}
              size="small"
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || !ticker.trim()}
            sx={{ width: '100%' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
        </Box>
        {showTickerMenu && (
          <Box display="flex" justifyContent="space-between" sx={{ marginTop: 2 }}>
            <Button disabled={loading || !ticker.trim()} variant="contained" color="secondary" sx={{ width: '30%' }}>
              Chat
            </Button>
            <Button onClick={() => setShowVolatilityChart(data => !data)} disabled={loading || !ticker.trim()} variant="contained" color="secondary" sx={{ width: '30%' }}>
              Volatitlity analysis
            </Button>
            <Button disabled={loading || !ticker.trim()} variant="contained" color="secondary" sx={{ width: '30%' }}>
              Report
            </Button>
          </Box>
        )}
        {showVolatilityChart && <VolatilityAnalysis ticker={ticker} showChart={showVolatilityChart} setShowChart={setShowVolatilityChart} />}
      </form>
    </Paper>
  );
};

export default AnalyzeTickerForm;