import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

const InsiderTrading = ({ insiderTrading = [], ticker, loading }) => {

  if (loading) {
    return (
      <Paper
        elevation={4}
        sx={{ padding: 3, borderRadius: 2 }}
      >
        <Box>
          <CircularProgress />

        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ marginTop: 3 }}>
      <Paper elevation={1} sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          <strong>Insider Trading for {ticker.toUpperCase()}</strong>
        </Typography>
        {insiderTrading.length > 0 ? (
          <Box>
            {insiderTrading.slice(0, 100).map((trade, index) => {
              const isSale = trade.transaction_type.toLowerCase().includes('sale');
              const isPurchase = trade.transaction_type.toLowerCase().includes('purchase');
              return (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: isSale ? 'red' : isPurchase ? 'green' : 'inherit' }}
                  >
                    <strong>Transaction: </strong>
                    {trade.transaction_type}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Filing date: </strong>
                    {trade.filing_date}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Owner: </strong>
                    {trade.owner}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Owned: </strong>
                    {trade.securities_owned}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Transacted: </strong>
                    {trade.securities_transacted}
                  </Typography>

                  <Typography variant="subtitle1">
                    <strong>Price: </strong>
                    {trade.price}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body2">
            No tradings available for this ticker.
          </Typography>
        )}
      </Paper>
    </Box>
  )
};

export default InsiderTrading;
