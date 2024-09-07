import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

const TradingViewAnalysis = ({ tradingViewAnalysis, loading }) => {
  return (
    <Box display="flex" sx={{ marginTop: 3, position: 'relative' }}>
      {loading ? (
   <Paper
   elevation={4}
   sx={{
     padding: 3,
     borderRadius: 2,
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     width: '100%',
     height: '100%',
   }}
 >
   <CircularProgress />
 </Paper>
      ) : (
        <>
          <Box flex="1" sx={{ marginRight: 1 }}>
            <Paper elevation={1} sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                <strong>{tradingViewAnalysis.interval} Tech Analysis for {tradingViewAnalysis?.ticker.toUpperCase()} </strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tradingViewAnalysis.timestamp}
              </Typography>
              <Typography variant="h5" gutterBottom>
                price: {tradingViewAnalysis?.indicators?.close.toFixed(2)} change: {tradingViewAnalysis?.indicators?.change.toFixed(2)} vol: {tradingViewAnalysis.indicators.volume}
              </Typography>
              
              <Typography component="pre" variant="body2" gutterBottom>
         
                  Buy: {JSON.stringify(tradingViewAnalysis.summary.BUY, null, 2)}
                  <br />
                  Neutral: {JSON.stringify(tradingViewAnalysis.summary.NEUTRAL, null, 2)}
                  <br />
                  Sell: {JSON.stringify(tradingViewAnalysis.summary.SELL, null, 2)}
                  <br />
                  Recommendation: {JSON.stringify(tradingViewAnalysis.summary.RECOMMENDATION, null, 2)}
                  <br />
                
              </Typography >              
              <Box sx={{ marginTop: 2 }}>
                <Typography component="pre" variant="subtitle1">Indicators:</Typography>
                {JSON.stringify(tradingViewAnalysis.indicators, null, 2)}
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography component="pre" variant="subtitle1">Moving Averages:</Typography>
                {JSON.stringify(tradingViewAnalysis.moving_averages, null, 2)}
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Typography component="pre" variant="subtitle1">Oscillators:</Typography>
                {JSON.stringify(tradingViewAnalysis.oscillators, null, 2)}
              </Box>
            </Paper>
          </Box>
          <Box flex="1" sx={{ marginLeft: 0 }}>
            <Paper elevation={1} sx={{ padding: 2 }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: tradingViewAnalysis.AI_recommendation,
                }}
                style={{ whiteSpace: 'pre-wrap', paddingLeft: 10 }}
              />
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TradingViewAnalysis;