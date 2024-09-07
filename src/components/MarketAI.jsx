import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const MarketAI = ({ handleMarketTrend, loading, marketAI }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && marketAI) {
      const links = containerRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
      });
    }
  }, [marketAI]);

  return (
    <Paper elevation={3} sx={{ padding: 2, height: '55%',  minHeight: '150' }}>
      <Typography variant="h5" gutterBottom>
        Market AI
      </Typography>
     
      {marketAI && !loading && (
        <Box
          ref={containerRef}
          sx={{
            marginTop: 2,
            padding: 4,
            border: '1px solid #ccc',
            borderRadius: '8px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: marketAI }}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </Box>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
          <Typography variant="body1" align="center">
            🔍 Analyzing markets... Your Market AI insights are coming right up! 🚀
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MarketAI;
