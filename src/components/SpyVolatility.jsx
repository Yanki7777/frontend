import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, CircularProgress, Paper } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../utils/config';

function SpyVolatility() {
  const [ticker, setTicker] = useState('');
  const [interval, setInterval] = useState('1d');
  const [period, setPeriod] = useState('1mo');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateVolatilityData = async () => {
    try {
      const res = await axios.post(`${baseUrl}/ticker-volatility`, { ticker: "SPY", period: '5d', interval:'1d' });       
    //   setHistoricalChanges(res.data.percentage_changes);      
    //   setChangeSummary(res.data.change_summary);
      console.log('SPY VOLATILITY:', res.data,
         'change_summery', res.data.change_summary,        
        );
    } catch (e) {
      console.error('Failed to fetch volatility data:', e);
    }
  };

  useEffect(() => {
    updateVolatilityData();
    console.log('SPY Volatility Updated');
  }, []);

  return (
    <Paper style={{ padding: 16, margin: '16px 0' }}>
      <Typography variant="h6" gutterBottom>
        SPY Volatility Analysis
      </Typography>
      
      
      
    </Paper>
  );
}

export default SpyVolatility;
