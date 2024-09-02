import { Box, Paper, Typography, Button, ButtonGroup, CircularProgress } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { baseUrl } from '../utils/config';

const HistoricalPricesChart = ({ chartData, setHistoricalPrices, ticker, loading }) => {
  const [period, setPeriod] = React.useState('10y');  

  const updateHistoricalPrices = React.useCallback(async () => {
    try {
      // console.time('historical_data');
      console.log('Fetching historical data for', ticker, 'with period', period);
      const res = await axios.post(`${baseUrl}/historical_data`, { ticker, period: period });
      setHistoricalPrices({data:res.data.historical_data,period:period});
      // console.timeEnd('historical_data');
    } catch (e) {
      console.error('Failed to fetch historical data:', e);
    }
  }, [period, ticker]);

  React.useEffect(() => {
    updateHistoricalPrices();
  }, [period, ticker, updateHistoricalPrices]);
  
  React.useEffect(() => {
    if (chartData && chartData.period !== period) {
      updateHistoricalPrices();
    }
  }, [chartData]);

  const periods = [
    { label: '1 Day', value: '1d' },
    { label: '5 Days', value: '5d' },
    { label: '1 Month', value: '1mo' },
    { label: '3 Months', value: '3mo' },
    { label: '6 Months', value: '6mo' },
    { label: '1 Year', value: '1y' },
    { label: '2 Years', value: '2y' },
    { label: '5 Years', value: '5y' },
    { label: '10 Years', value: '10y' },
    { label: 'YTD', value: 'ytd' },
    { label: 'Max', value: 'max' },   
  ];

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Paper elevation={1} sx={{ padding: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
        <ButtonGroup variant="outlined" sx={{ marginBottom: 2, gap: 0 }}>
          {periods.map((frame, index) => {
            const isSelected = period === frame.value;
            return (
              <Button
                key={frame.value}
                onClick={() => setPeriod(frame.value)}
                sx={{
                  fontWeight: 'semi-bold',
                  color: isSelected ? 'secondary.main' : 'inherit',
                  borderColor: 'primary.main',
                  borderLeft: index === 0 ? '1px solid rgba(0, 0, 0, 0.12)' : 'inherit',
                  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    backgroundColor: isSelected ? 'secondary.light' : 'inherit',
                    borderColor: isSelected ? 'primary.dark' : 'primary.main',
                  },
                  '&:not(:first-of-type)': {
                    borderLeft: 'none',
                  },
                }}
                disabled={loading}
              >
                {frame.label}
              </Button>
            );
          })}
        </ButtonGroup>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          chartData && chartData.datasets ? (
            <Box sx={{ width: '100%', height: '100%', minHeight: '650px' }}>
              <Line 
                data={chartData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      ticks: {
                        font: {
                          size: 18, // Increase the font size of the y-axis labels
                        },
                      },
                    },
                  },
                }} 
              />
            </Box>
          ) : (
            <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center' }}>
              No chart available.<br /> Analyze ticker to get chart
            </Typography>
          )
        )}
      </Paper>
    </Box>
  );
};

export default HistoricalPricesChart;