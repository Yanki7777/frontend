import React, { useEffect, useState, useCallback } from 'react';
import {Box, Button, CircularProgress, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, } from '@mui/material';
import { memo } from 'react';
import { saveAs } from 'file-saver';

const TickerRow = memo(({ ticker_item, activeTicker, onClickTicker }) => (
  <TableRow
    onClick={() => onClickTicker(ticker_item)}
    sx={{
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      backgroundColor: activeTicker === ticker_item.ticker ? '#e0e0e0' : '#ffffff',
      '&:hover': {
        backgroundColor: activeTicker === ticker_item.ticker ? '#d0d0d0' : '#43d397',
      },
    }}
  >
    <TableCell>{ticker_item.exchange}:<strong>{ticker_item.ticker}</strong></TableCell>
    <TableCell>{ticker_item.ta_ind1_recommendation}</TableCell>
    <TableCell>{ticker_item.ta_ma1_recommendation}</TableCell>
    <TableCell>{ticker_item.ta_osc1_recommendation}</TableCell>
    <TableCell>{ticker_item.ta_rsi1}</TableCell>
    <TableCell>{ticker_item.ta_ind2_recommendation}</TableCell>
    <TableCell>{ticker_item.ta_ma2_recommendation}</TableCell>
    <TableCell>{ticker_item.ta_osc2_recommendation}</TableCell>
    <TableCell>{ticker_item.ta_rsi2}</TableCell>
    <TableCell>{ticker_item.analyst_recommendation}</TableCell>
  </TableRow>
));

const Trade = ({ handleTrade, loading, portfolio, setTicker, setExchange, handleAnalyze }) => {
  const [activeTicker, setActiveTicker] = useState(null);

  const onClickTicker = useCallback(
    (ticker_item) => {
      setTicker(ticker_item.ticker);
      setExchange(ticker_item.exchange);
      setActiveTicker(ticker_item.ticker);
    },
    [setTicker, setExchange]
  );

  useEffect(() => {
    if (activeTicker) {
      handleAnalyze();
      setActiveTicker(null);
    }
  }, [activeTicker, handleAnalyze]);

  const hasTickers = portfolio?.tickers?.length > 0;

  const downloadCSV = () => {
    if (!hasTickers) return;
  
    const csvHeaders = [
      'Ticker',
      'Ind1',
      'MA1',
      'Osc1',
      'RSI1',
      'Ind2',
      'MA2',
      'Osc2',
      'RSI2',
      'Analyst',
    ];
  
    const rows = portfolio.tickers.map(ticker_item => [
      `${ticker_item.exchange}:${ticker_item.ticker}`,
      ticker_item.ta_ind1_recommendation,
      ticker_item.ta_ma1_recommendation,
      ticker_item.ta_osc1_recommendation,
      ticker_item.ta_rsi1,
      ticker_item.ta_ind2_recommendation,
      ticker_item.ta_ma2_recommendation,
      ticker_item.ta_osc2_recommendation,
      ticker_item.ta_rsi2,
      ticker_item.analyst_recommendation,
    ]);
  
    const csvContent = [csvHeaders, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))  // Escape commas and quotes
      .join('\n');
  
    // Get the universe name and current date-time for the file name
    const universeName = portfolio.universe || 'universe';
    const dateTime = new Date().toISOString().replace(/[:]/g, '-').replace(/\..+/, ''); // Format: YYYY-MM-DDTHH-MM-SS
  
    console.log('portfolio', portfolio);
    const fileName = `portfolio-${universeName}-${dateTime}.csv`;
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
  };
  
  return (
    <Paper elevation={3} sx={{ padding: 1, minHeight: '650px' , display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box display="flex" justifyContent="center" sx={{ marginBottom: 1 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTrade}
          sx={{ flex: 1, height: 30 }}
          disabled={!portfolio}
        >
          {loading ? <CircularProgress size={24} /> : 'Trade'}
        </Button>
      </Box>

      {portfolio?.interval1 && (
        <Box
          sx={{
            backgroundColor: '#f0f0f0',
            padding: '4px 8px',
            borderRadius: '4px',
            marginBottom: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1">
            Interval1: {portfolio.interval1} Interval2: {portfolio.interval2} Stocks: {portfolio?.tickers.length}
          </Typography>
        </Box>
      )}

      {hasTickers && (
        <Box
          sx={{
            padding: 2,
            border: '1px solid #ccc',
            borderRadius: '8px',
            maxHeight: '440px',
            overflowY: 'auto',
          }}
        >
          <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#f0f0f0',
                  fontWeight: 'bold',
                }}
              >
                <TableCell>Ticker</TableCell>
                <TableCell>Ind1</TableCell>
                <TableCell>MA1</TableCell>
                <TableCell>Osc1</TableCell>
                <TableCell>RSI1</TableCell>
                <TableCell>Ind2</TableCell>
                <TableCell>MA2</TableCell>
                <TableCell>Osc2</TableCell>
                <TableCell>RSI2</TableCell>
                <TableCell>Analyst</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.tickers.map((ticker_item, index) => (
                <TickerRow
                  key={index}
                  ticker_item={ticker_item}
                  activeTicker={activeTicker}
                  onClickTicker={onClickTicker}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
          <Typography variant="body1" align="center">
            🔍 Analyzing universe... Your portfolio is coming right up! 🚀
          </Typography>
        </Box>
      )}

{hasTickers && (
  <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
    <Button
      variant="contained"
      color="secondary"
      onClick={downloadCSV}
      sx={{ width: '150px', marginTop: 'auto' }}  // Adjust the width as needed
    >
      CSV
    </Button>
  </Box>
)}

    </Paper>
  );
};

export default Trade;
