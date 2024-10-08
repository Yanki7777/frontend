import { Box, Paper, Typography, Button, ButtonGroup, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { baseUrl } from '../utils/config';

const TickerChart = ({ chartData, setHistoricalPrices, ticker, loading }) => {
  const [period, setPeriod] = useState('1d');
  const [macdData, setMacdData] = useState(null); // State for MACD data
  const [macdLoading, setMacdLoading] = useState(false); // State to show loading for MACD

  const updateHistoricalPrices = useCallback(async () => {
    try {
      const res = await axios.post(`${baseUrl}/historical-data`, { ticker, period });
      setHistoricalPrices({ data: res.data.historical_data, period });
    } catch (e) {
      console.error('Failed to fetch historical data:', e);
    }
  }, [period, ticker, setHistoricalPrices]);

  const fetchMACDData = useCallback(async () => {
    setMacdLoading(true);
    console.log('Fetching MACD data for', ticker, ' period', period);
    try {
      const res = await axios.post(`${baseUrl}/ta-macd-data`, {
        ticker,
        period: period
      });

      const macdData = res.data.macd_data.map(item => ({
        timestamp: item.timestamp,
        MACD: item.MACD,
        MACD_Signal: item.MACD_Signal,
        MACD_Hist: item.MACD_Hist
      }));

      setMacdData(macdData);
      console.log('MACD Data:', macdData);
    } catch (e) {
      console.error('Failed to fetch MACD data:', e);
    } finally {
      setMacdLoading(false);
    }
  }, [ticker, period]);

  useEffect(() => {
    updateHistoricalPrices();
    fetchMACDData();
  }, [period, ticker, updateHistoricalPrices, fetchMACDData]);

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
                                  fontWeight: isSelected ? 'bold' : 'semi-bold', // Make the font weight bolder if selected
                                  color: isSelected ? 'secondary.main' : 'inherit',
                                  borderColor: 'primary.main',
                                  borderLeft: index === 0 ? '1px solid rgba(0, 0, 0, 0.12)' : 'inherit',
                                  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                                  backgroundColor: isSelected ? 'rgba(255, 215, 0, 0.3)' : 'inherit', // Change background color to a lighter shade if selected
                                  '&:hover': {
                                    backgroundColor: isSelected ? 'rgba(255, 215, 0, 0.3)' : 'inherit',
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
            <Box sx={{ width: '100%', height: '100%', minHeight: '300px' }}>
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

        {/* MACD Chart */}
        {macdLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          macdData && (
            <Box sx={{ width: '100%', height: '100%', marginTop: 3 }}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                MACD Graph
              </Typography>
              <Box sx={{ height: '300px', overflow: 'auto' }}>
                <Line
                  data={{
                    labels: macdData.map(item => item.timestamp), // Use timestamps for X-axis
                    datasets: [
                      {
                        label: 'MACD',
                        data: macdData.map(item => item.MACD),
                        borderColor: 'blue',
                        fill: false,
                      },
                      {
                        label: 'Signal',
                        data: macdData.map(item => item.MACD_Signal),
                        borderColor: 'red',
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    height: 500,
                  }}
                />
              </Box>

              {/* MACD Histogram */}
              <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
                MACD Histogram
              </Typography>
              <Box sx={{ height: '200px', overflow: 'auto' }}>
                <Bar
                  data={{
                    labels: macdData.map(item => item.timestamp),
                    datasets: [
                      {
                        label: 'Histogram',
                        data: macdData.map(item => item.MACD_Hist),
                        backgroundColor: macdData.map(item =>
                          item.MACD_Hist >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
                        ),
                        borderColor: macdData.map(item =>
                          item.MACD_Hist >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
                        ),
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    height: 300,
                  }}
                />
              </Box>
            </Box>
          )
        )}
      </Paper>
    </Box>
  );
};

export default TickerChart;