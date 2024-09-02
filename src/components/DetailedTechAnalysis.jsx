import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

const TechAnalysisResult = ({ techAnalysisResult, loading }) => {
  return (
    <Box display="flex" sx={{ marginTop: 3, position: 'relative'}}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box flex="1" sx={{ marginRight: 1 }}>
        <Paper elevation={1} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            <strong>{techAnalysisResult.interval} Tech Analysis for {techAnalysisResult?.ticker.toUpperCase()} </strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            {techAnalysisResult.timestamp}
          </Typography>
          <Typography variant="h5" gutterBottom>
            price: {techAnalysisResult?.indicators?.close.toFixed(2)} change: {techAnalysisResult?.indicators?.change.toFixed(2)} vol: {techAnalysisResult.indicators.volume}
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <pre>
              Buy: {JSON.stringify(techAnalysisResult.summary.BUY, null, 2)}
              <br />
              Neutral: {JSON.stringify(techAnalysisResult.summary.NEUTRAL, null, 2)}
              <br />
              Sell: {JSON.stringify(techAnalysisResult.summary.SELL, null, 2)}
              <br />
              Recommendation: {JSON.stringify(techAnalysisResult.summary.RECOMMENDATION, null, 2)}
              <br />
            </pre>
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1">Selected Indicators:</Typography>
            <pre>
              RSI {JSON.stringify(techAnalysisResult.indicators.RSI, null, 2)} <br /> 
              BB.lower {JSON.stringify(techAnalysisResult.indicators['BB.lower'], null, 2)} <br />  
              BB.upper {JSON.stringify(techAnalysisResult.indicators['BB.upper'], null, 2)} <br />  
              BBPower {JSON.stringify(techAnalysisResult.indicators['BBPower'], null, 2)}
            </pre>
            
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1">Indicators:</Typography>
            <pre>{JSON.stringify(techAnalysisResult.indicators, null, 2)}</pre>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1">Moving Averages:</Typography>
            <pre>{JSON.stringify(techAnalysisResult.moving_averages, null, 2)}</pre>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1">Oscillators:</Typography>
            <pre>{JSON.stringify(techAnalysisResult.oscillators, null, 2)}</pre>
          </Box>
        </Paper>
      </Box>
      <Box flex="1" sx={{ marginLeft: 0}}>
        <Paper elevation={1} sx={{ padding: 2 }}>
          <div
            dangerouslySetInnerHTML={{
              __html: techAnalysisResult.AI_recommendation,
            }}
            style={{ whiteSpace: 'pre-wrap', paddingLeft: 10 }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default TechAnalysisResult;