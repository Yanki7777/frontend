import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress, Grid } from '@mui/material';
import { Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [ticker, setTicker] = useState('QQQ');
  const [exchange, setExchange] = useState('NASDAQ');
  const [interval, setInterval] = useState('DAY');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalPrices, setHistoricalPrices] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticker.trim()) {
      setError('Ticker is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch analysis and historical prices in parallel
      const [analysisResponse, historicalResponse] = await Promise.all([
        axios.post('http://127.0.0.1:5000/api/analyze', { ticker, exchange, interval }),
        axios.post('http://127.0.0.1:5000/api/historical_data', { ticker }),
      ]);
  
      setResult(analysisResponse.data);
      setHistoricalPrices(historicalResponse.data.historical_data);  
    } catch (err) {
      setError(err.response?.data?.error || 'Server error, please try again later.');
      setResult(null);
      setHistoricalPrices(null);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!historicalPrices) return null;
  
    const labels = historicalPrices.map(price => new Date(price.Date).toLocaleDateString());
    const closeData = historicalPrices.map(price => price.Close);
    const volumeData = historicalPrices.map(price => price.Volume);
  
    return {
      labels,
      datasets: [
        {
          label: `${ticker.toUpperCase()} Close Prices`,
          data: closeData,
          fill: false,
          borderColor: 'rgba(153,102,255,1)',
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          label: `${ticker.toUpperCase()} Volume`,
          data: volumeData,
          fill: false,
          borderColor: 'rgba(255,206,86,1)',
          tension: 0.1,
          yAxisID: 'y1',
        },
      ],
    };
  };
  
  return (
    <Container maxWidth={false} style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '30px', width: '95%', margin: '0 auto' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Y Analysis
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter Ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                error={!!error && !ticker.trim()}
                helperText={!!error && !ticker.trim() ? 'Ticker is required' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter Exchange"
                value={exchange}
                onChange={(e) => setExchange(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter Interval"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" marginBottom="20px">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Analyze'}
            </Button>
          </Box>
        </form>

        {historicalPrices && (
          <Box marginTop="30px">
            <Paper elevation={1} style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Historical prices
              </Typography>
              <Line 
                data={getChartData()} 
                options={{
                  scales: {
                    y: {
                      type: 'linear',
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Price',
                      },
                    },
                    y1: {
                      type: 'linear',
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Volume',
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
            </Paper>
          </Box>
        )}
        {result && (
          <Box display="flex" marginTop="30px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} style={{ padding: '20px' }}>
                  <Typography variant="body1" gutterBottom>
                    {result.timestamp}
                  </Typography>    
                  <Typography variant="h6" gutterBottom>
                    <strong>{result.ticker.toUpperCase()}</strong> {result.interval} price: {result.indicators.close.toFixed(2)} change: {result.indicators.change.toFixed(2)} vol: {result.indicators.volume}
                  </Typography>          
                  <Typography variant="body1">
                    <strong>{result.recommendation}</strong>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <pre>
                      Buy: {JSON.stringify(result.summary.BUY, null, 2)}<br></br>
                      Neutral: {JSON.stringify(result.summary.NEUTRAL, null, 2)}<br></br>
                      Sell: {JSON.stringify(result.summary.SELL, null, 2)}<br></br>
                      Recommendation: {JSON.stringify(result.summary.RECOMMENDATION, null, 2)}<br></br>
                    </pre>
                  </Typography>
                  <Box marginTop={2}>
                    <Typography variant="subtitle1">Indicators:</Typography>
                    <pre>{JSON.stringify(result.indicators, null, 2)}</pre>
                  </Box>
                  <Box marginTop={2}>
                    <Typography variant="subtitle1">Oscillators:</Typography>
                    <pre>{JSON.stringify(result.oscillators, null, 2)}</pre>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                  <div dangerouslySetInnerHTML={{ __html: result.AI_recommendation }} style={{ whiteSpace: 'pre-wrap' }} />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        {error && (
          <Alert severity="error" style={{ marginTop: '20px' }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default App;
