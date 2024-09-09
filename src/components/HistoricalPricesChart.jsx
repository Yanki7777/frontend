import { Box, Paper, Typography, Button, ButtonGroup, CircularProgress } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { baseUrl } from '../utils/config';

const HistoricalPricesChart = ({ chartData, setHistoricalPrices, ticker, loading }) => {
  const [period, setPeriod] = React.useState('10y');  
  const [macdData, setMacdData] = React.useState(null); // State for MACD data
  const [macdLoading, setMacdLoading] = React.useState(false); // State to show loading for MACD
  const [interval, setInterval] = React.useState('1d'); // Default interval for MACD

  const updateHistoricalPrices = React.useCallback(async () => {
    try {
      const res = await axios.post(`${baseUrl}/historical-data`, { ticker, period });
      setHistoricalPrices({ data: res.data.historical_data, period });
    } catch (e) {
      console.error('Failed to fetch historical data:', e);
    }
  }, [period, ticker, setHistoricalPrices]);

  React.useEffect(() => {
    updateHistoricalPrices();
  }, [period, ticker, updateHistoricalPrices]);

  const fetchMACDData = async () => {
    setMacdLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/ta-macd-data`, {
        ticker,
        tickerInterval: interval // Sending interval with the request
      });
      
      const macdData = res.data.macd_data.map(item => ({
        date: item.timestamp,
        macd: item.MACD,
        signal: item.MACD_Signal,
        histogram: item.MACD_Hist
      }));

      setMacdData(macdData);
    } catch (e) {
      console.error('Failed to fetch MACD data:', e);
    } finally {
      setMacdLoading(false);
    }
  };

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

        {/* MACD Button */}
        <Button
          variant="contained"
          onClick={fetchMACDData}
          sx={{ mt: 2 }}
          disabled={macdLoading || loading}
        >
          {macdLoading ? <CircularProgress size={20} /> : 'MACD Graph'}
        </Button>

        {/* MACD Chart */}
        {macdData && (
          <Box sx={{ width: '100%', marginTop: 3 }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              MACD Graph
            </Typography>
            <Line
              data={{
                labels: macdData.map(item => item.date), // Use timestamps for X-axis
                datasets: [
                  {
                    label: 'MACD',
                    data: macdData.map(item => item.macd),
                    borderColor: 'blue',
                    fill: false,
                  },
                  {
                    label: 'Signal',
                    data: macdData.map(item => item.signal),
                    borderColor: 'orange',
                    fill: false,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
            />

            {/* MACD Histogram */}
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
              MACD Histogram
            </Typography>
            <Bar
              data={{
                labels: macdData.map(item => item.date), // Same timestamps as above
                datasets: [
                  {
                    label: 'Histogram',
                    data: macdData.map(item => item.histogram),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default HistoricalPricesChart;
