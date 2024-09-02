import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';


const Trade = ({ handleTrade, loading, portfolio, setTicker, setExchange, handleAnalyze }) => {

  // console.log('Portfolio Tickers:', portfolio?.tickers);


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

  

  return (
    <Paper elevation={3} sx={{ padding: 1, height: 'auto', minHeight: '650px' }}>      
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

      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Box display="flex" justifyContent="center" width="100%">
          {portfolio?.interval1 && (
            <Typography variant="body1">
              Interval1:{portfolio.interval1} Interval2:{portfolio.interval2} Stocks:{portfolio?.tickers.length}
            </Typography>
          )}
        </Box>
      </Box>
     
      {/* Conditionally render the recommended list only if it's not null or undefined */}
      {portfolio?.tickers?.length > 0 && (
        <Box
          sx={{
            marginTop: 2,
            padding: 2,
            border: '1px solid #ccc',
            borderRadius: '8px',
            maxHeight: '440px',
            overflowY: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#f0f0f0',
                  fontWeight: 'bold',
                  borderRadius: '5px',
                }}
              >
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>Ticker</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>Ind1</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>MA1</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>Osc1</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>RSI1</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>Ind2</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>MA2</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>Osc2</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>RSI2</th>
                <th style={{ padding: '5px 10px', border: '1px solid #ccc' }}>Ana</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.tickers.map((ticker_item, index) => (
                <tr
                  key={index}
                  onClick={() => onClickTicker(ticker_item)}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    border: '1px solid #ccc',
                    backgroundColor:
                      activeTicker === ticker_item.ticker ? '#e0e0e0' : '#ffffff',
                  }}
                  onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    activeTicker === ticker_item.ticker ? '#d0d0d0' : '#43d397')
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    activeTicker === ticker_item.ticker ? '#e0e0e0' : '#ffffff')
                  }
                >
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.exchange}:<strong>{ticker_item.ticker}</strong>
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.ta_ind1_recommendation}
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.ta_ma1_recommendation}
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.ta_osc1_recommendation}
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.ta_rsi1}
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.ta_ind2_recommendation}
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.ta_ma2_recommendation}
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.ta_osc2_recommendation}
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.ta_rsi2}
                  </td>
                  <td style={{ padding: '5px 10px', border: '1px solid #ccc' }}>
                    {ticker_item.analyst_recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
          <Typography variant="body1" align="center">
            🔍 Analyzing universe... Your portfolio is coming right up! 🚀
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Trade;
