import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { baseUrl } from '../utils/config';
import { getInsiderTradingUniverse } from '../api';

const UniInsiderTrading= ( {selectedUniverse}) => {
  const [insiderTrades, setInsiderTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsiderTrades = async () => {
    try {      
      const res = getInsiderTradingUniverse(selectedUniverse);
      setInsiderTrades(res.data);   
    } catch (err) {
      setError('Failed to fetch insider buying data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsiderTrades();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginLeft: 16 }}>
          Loading Insider Buying Data...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" color="primary" onClick={fetchInsiderTrades} style={{ marginTop: 16 }}>
          Retry
        </Button>
      </div>
    );
  }

  return (      
    <box>
    <Typography variant="h4" style={{ marginBottom: 16, textAlign: "center" }}>
      {insiderTrades.universe}
    </Typography>
    <TableContainer component={Paper} style={{ maxHeight: 600}}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Transaction Type</TableCell>
            <TableCell>Trading Date</TableCell>
            <TableCell>Filing Date</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Securities Owned</TableCell>
            <TableCell>Securities Transacted</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {insiderTrades.insider_trading.map((trade, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ fontSize: '1.2rem' }}>{trade.symbol}</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>{trade.transaction_type}</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>{trade.trading_date}</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>{trade.filing_date}</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>{trade.owner}</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>{trade.securities_owned}</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>{trade.securities_transacted}</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>{trade.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </box>
  );
};

export default UniInsiderTrading;