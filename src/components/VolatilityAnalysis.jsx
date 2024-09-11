import React, { useState, useEffect } from 'react';
import { Box, Paper, CircularProgress, Typography, Button, ButtonGroup } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../utils/config';
import VolatilityGraph from './VolatilityGraph'; // Import the new component

const VolatilityAnalysis = ({ ticker, loading, showChart, setShowChart }) => {
  const [historicalClosingPrices, setHistoricalClosingPrices] = useState(null);
  const [historicalChanges, setHistoricalChanges] = useState(null);
  const [dates, setDates] = useState(null);
  const [changeSummary, setChangeSummary] = useState(null);
  const [period, setPeriod] = useState('1y');
  const [interval, setInterval] = useState('1d');


  const updateVolatilityData = async () => {
    try {
      const res = await axios.post(`${baseUrl}/ticker-volatility`, { ticker, interval, period });    
      setHistoricalClosingPrices(res.data.closing_prices);
      setHistoricalChanges(res.data.percentage_changes);
      setDates(res.data.dates);
      setChangeSummary(res.data.change_summary);
      console.log('VOLATILITY:', res.data,
         'change_summery', res.data.change_summary,
        );
    } catch (e) {
      console.error('Failed to fetch volatility data:', e);
    }
  };

  useEffect(() => {
    updateVolatilityData();  
  }, [ticker, interval, period]);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Paper elevation={1} sx={{ padding: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
  
        {loading && <CircularProgress />}
        {!loading && historicalClosingPrices && historicalChanges ? (
          <VolatilityGraph
            open={showChart}
            onClose={() => setShowChart(false)}
            historicalClosingPrices={historicalClosingPrices}
            historicalChanges={historicalChanges}
            dates={dates}            
            changeSummary={changeSummary}
            ticker={ticker}
            setPeriod={setPeriod}
            setInterval={setInterval}
            period={period}
            interval={interval}
          />
        ) : (
          <Typography>No Data Available</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default VolatilityAnalysis;