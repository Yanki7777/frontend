import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { Alert } from '@mui/material';

function App() {
  const [ticker, setTicker] = useState('');
  const [exchange, setExchange] = useState('NASDAQ')
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/analyze', { ticker, exchange });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'An error occurred');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '30px' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Y Analysis
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Enter Exchange"
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Analyze'}
            </Button>
          </Box>
        </form>
        {result && (
          <Paper elevation={1} style={{ marginTop: '30px', padding: '20px' }}>
            <Typography variant="body1" gutterBottom>
              { result.timestamp}
            </Typography>    
            <Typography variant="h6" gutterBottom>
              <strong> {result.ticker.toUpperCase()}</strong> price:{result.indicators.close.toFixed(2)} change:{result.indicators.change.toFixed(2)} vol:{result.indicators.volume}
            </Typography>          
            <Typography variant="body1">
              <strong>{result.recommendation}</strong>
              <Typography variant="body2" gutterBottom>
              <pre>
                Buy: {JSON.stringify(result.summary.BUY, null, 2)}<br></br>
                Neutral: {JSON.stringify(result.summary.NEUTRAL, null, 2)}<br></br>
                Sell: {JSON.stringify(result.summary.SELL, null, 2)}<br></br>
                Recommendation: {JSON.stringify(result.summary.RECOMMENDATION, null, 2)}<br></br>
              </pre>
            </Typography>
            </Typography>
            <Box marginTop={2}>
              <Typography variant="subtitle1">Indicators:</Typography>
              <pre>{JSON.stringify(result.indicators, null, 2)}</pre>
            </Box>
            <Box marginTop={2}>
              <Typography variant="subtitle1">Oscillators:</Typography>
              <pre>{JSON.stringify(result.oscillators, null, 2)}</pre>
            </Box>
            <Box marginTop={2} style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Typography variant="subtitle1">AI Recommendation:</Typography>
              <div dangerouslySetInnerHTML={{ __html: result.AI_recommendation }} style={{ whiteSpace: 'pre-wrap' }} />
            </Box>

          </Paper>
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
