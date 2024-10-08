import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, CircularProgress, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, } from '@mui/material';
import { memo } from 'react';
import { saveAs } from 'file-saver';

const TradeRow = memo(({ trade_item, activeTicker, onClickTicker }) => (
  <TableRow
    onClick={() => onClickTicker(trade_item)}
    sx={{
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      backgroundColor: activeTicker === trade_item.ticker ? '#e0e0e0' : '#ffffff',
      '&:hover': {
        backgroundColor: activeTicker === trade_item.ticker ? '#d0d0d0' : '#43d397',
      },
    }}
  >
    <TableCell>{trade_item.exchange}:<strong>{trade_item.ticker}</strong></TableCell>
    <TableCell>{trade_item.tv_ind1_recommendation}</TableCell>
    <TableCell>{trade_item.tv_ma1_recommendation}</TableCell>
    <TableCell>{trade_item.tv_osc1_recommendation}</TableCell>
    <TableCell>{trade_item.tv_rsi1}</TableCell>
    <TableCell>{JSON.stringify(trade_item.ta_interval1_1).substring(0, 20)}</TableCell>
    <TableCell>{JSON.stringify(trade_item.ta_interval1_2).substring(0, 20)}</TableCell>
    <TableCell>{trade_item.tv_ind2_recommendation}</TableCell>
    <TableCell>{trade_item.tv_ma2_recommendation}</TableCell>
    <TableCell>{trade_item.tv_osc2_recommendation}</TableCell>
    <TableCell>{trade_item.tv_rsi2}</TableCell>
    <TableCell>{JSON.stringify(trade_item.ta_interval2_1).substring(0, 20)}</TableCell>
    <TableCell>{JSON.stringify(trade_item.ta_interval2_2).substring(0, 20)}</TableCell>
    <TableCell>{trade_item.analyst_recommendation}</TableCell>
  </TableRow>
));

const Trade = ({ loading, portfolio, setTicker, setExchange, handleAnalyze }) => {
  const [activeTicker, setActiveTicker] = useState(null);

  const onClickTicker = useCallback(
    (trade_item) => {
      setTicker(trade_item.ticker);
      setExchange(trade_item.exchange);
      setActiveTicker(trade_item.ticker);
    },
    [setTicker, setExchange]
  );

  useEffect(() => {
    if (activeTicker) {
      handleAnalyze();
      setActiveTicker(null);
    }
  }, [activeTicker, handleAnalyze]);

  const hasTrades = portfolio?.trades?.length > 0;

  const downloadCSV = () => {
    if (!hasTrades) return;

    // Extract portfolio fields
    const portfolioFields = [
      ['Universe', portfolio.universe || 'universe'],
      ['Timestamp', portfolio.creation_date || 'unknown'],
      ['Interval1', portfolio.interval1],
      ['Interval2', portfolio.interval2],
      ['Stocks', portfolio.trades.length],
    ];

    const csvHeaders = [
      'Exchange',
      'Ticker',
      'Ind1',
      'MA1',
      'Osc1',
      'RSI1',
      'TA1_1',
      'TA1_2',
      'Ind2',
      'MA2',
      'Osc2',
      'RSI2',
      'TA2_1',
      'TA2_2',
      'Analyst',
    ];

    const rows = portfolio.trades.map(trade_item => [
      trade_item.exchange,
      trade_item.ticker,
      trade_item.tv_ind1_recommendation,
      trade_item.tv_ma1_recommendation,
      trade_item.tv_osc1_recommendation,
      trade_item.tv_rsi1,
      JSON.stringify(trade_item.ta_interval1_1), 
      JSON.stringify(trade_item.ta_interval1_2), 
      trade_item.tv_ind2_recommendation,
      trade_item.tv_ma2_recommendation,
      trade_item.tv_osc2_recommendation,
      trade_item.tv_rsi2,
      JSON.stringify(trade_item.ta_interval2_1), 
      JSON.stringify(trade_item.ta_interval2_2), 
      trade_item.analyst_recommendation,
    ]);

    const csvContent = [
      ...portfolioFields.map(field => field.join(',')),
      '',
      csvHeaders.join(','),
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const universeName = portfolio.universe || 'universe';
    const creationDate = (portfolio.creation_date || 'unknown').replace(/[:]/g, '-').replace(/\..+/, ''); // Format: YYYY-MM-DDTHH-MM-SS

    const fileName = `portfolio-${universeName}-${creationDate}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
  };

  const handleTrade = () => {};

  return (
    <Paper elevation={3} sx={{ padding: 1, minHeight: '650px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
            Interval1: {portfolio.interval1} Interval2: {portfolio.interval2} Stocks: {portfolio?.trades.length}
          </Typography>
        </Box>
      )}

      {hasTrades && (
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
                <TableCell>TA1_1</TableCell>
                <TableCell>TA1_2</TableCell>
                <TableCell>Ind2</TableCell>
                <TableCell>MA2</TableCell>
                <TableCell>Osc2</TableCell>
                <TableCell>RSI2</TableCell>
                <TableCell>TA2_1</TableCell>
                <TableCell>TA2_2</TableCell>
                <TableCell>Analyst</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.trades.map((trade_item, index) => (
                <TradeRow
                  key={index}
                  trade_item={trade_item}
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

      {hasTrades && (
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
