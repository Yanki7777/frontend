import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Line } from 'react-chartjs-2';

const VolatilityGraph = ({ open, onClose, historicalClosingPrices, historicalChanges, dates, changeSummary, ticker, setPeriod, setInterval, period, interval }) => {
  const [selectedInterval, setSelectedInterval] = useState('1d'); // Default interval
  const [selectedPeriod, setSelectedPeriod] = useState('1mo'); // Default period

  const createChartOptions = (label) => ({
    scales: {
      y: {
        ticks: {
          font: {
            size: 14, // Increase Y-axis label size
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 14, // Increase X-axis label size
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false, // Ensure the chart uses the full available space
  });

  const chartHeight = `calc(35vh)`; // Set each chart height to 35% of the viewport height

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg" // Set max width of the dialog
      fullWidth // Make the dialog take up the max width
      PaperProps={{
        sx: {
          width: '80%', // Set width to 80% of the screen
          height: '82%', // Set height to 82% of the screen
          margin: 'auto', // Center the dialog
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      aria-labelledby="graph-dialog-title"
      aria-describedby="graph-dialog-description"
    >
      <DialogTitle id="graph-dialog-title" sx={{ fontSize: '2.4rem', textAlign: 'center' }}>
        <strong>{ticker}</strong> - Volatility Analysis
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{ marginBottom: 2, padding: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="period-select-label">Select Period</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            label="Select Period"
            value={period}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              setPeriod(e.target.value);
            }}
          >
            {['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'].map(period => (
              <MenuItem key={period} value={period}>
                {period}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="interval-select-label">Select Interval</InputLabel>
          <Select
            labelId="interval-select-label"
            id="interval-select"
            label="Select Interval"
            value={interval}
            onChange={(e) => {
              setSelectedInterval(e.target.value);
              setInterval(e.target.value);
            }}
          >
            {['1m', '5m', '15m', '1h', '1d', '5d', '1wk', '1mo', '3mo'].map(interval => (
              <MenuItem key={interval} value={interval}>
                {interval}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <DialogContent id="graph-dialog-description" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {historicalClosingPrices && historicalChanges ? (
          <>
            <div style={{ height: chartHeight }}>
              <Line
                data={{
                  labels: dates, // Use actual date labels if available
                  datasets: [
                    {
                      label: 'Closing Prices',
                      data: historicalClosingPrices,
                      borderColor: 'rgba(75,192,192,1)',
                      fill: false,
                    },
                  ],
                }}
                options={createChartOptions('Closing Prices')}
                height={chartHeight} // Adjust chart height
              />
            </div>
            <div style={{ height: chartHeight, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(220, 220, 2200, 0.8)', padding: 1, borderRadius: 1, boxShadow: 1 }}>
         
                <Typography variant="body2">Avg Positive%: <strong>{changeSummary.avg_positive_change}</strong></Typography>
                <Typography variant="body2">Max Positive%: <strong>{changeSummary.max_positive_change}</strong></Typography>
                <Typography variant="body2">Positives: <strong>{changeSummary.num_positive_changes}</strong></Typography>
                <Typography variant="body2">Avg Negative%: <strong>{changeSummary.avg_negative_change}</strong></Typography>
                <Typography variant="body2">Max Negative%: <strong>{changeSummary.max_negative_change}</strong></Typography>                
                <Typography variant="body2">Negatives: <strong>{changeSummary.num_negative_changes}</strong></Typography>
             
              </Box>
              <Line
                data={{
                  labels: dates, // Use actual date labels if available
                  datasets: [
                    {
                      label: 'Percentage Changes',
                      data: historicalChanges,
                      borderColor: 'rgba(192,75,75,1)',
                      fill: false,
                    },
                  ],
                }}
                options={createChartOptions('Percentage Changes')}
                height={chartHeight} // Adjust chart height
              />
            </div>
          </>
        ) : (
          <Typography>No Data Available</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VolatilityGraph;