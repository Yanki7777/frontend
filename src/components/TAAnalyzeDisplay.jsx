import React, { useRef } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button
} from '@mui/material';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const TAAnalyzeDisplay = ({ taData, loading }) => {
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const handleDownloadCSV = () => {
    if (taData && taData.indicators_list && Object.keys(taData.indicators_list).length > 0) {
      const data = Object.entries(taData.indicators_list).map(([timestamp, indicators]) => {
        return {
          timestamp,
          ...indicators
        };
      });

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'indicators_data.csv');
    } else {
      console.error("No data found or empty data in indicators_list");
    }
  };

  const syncScroll = (source, target) => {
    target.scrollLeft = source.scrollLeft;
  };

  const handleHorizontalScroll = (e) => {
    const source = e.target;
    const target = source === headerRef.current ? bodyRef.current : headerRef.current;
    syncScroll(source, target);
  };

  if (loading) {
    return (
      <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
        <Box>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (!taData) {
    return (
      <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center' }}>
        No analysis available.<br /> Analyze ticker to get analysis
      </Typography>
    );
  }

  const indicatorKeys = Object.keys(taData.indicators_list[Object.keys(taData.indicators_list)[0]]);
  const timestamps = Object.keys(taData.indicators_list).reverse();

  return (
    <Paper elevation={3} sx={{ padding: 1, borderRadius: 2, position: 'relative', overflow: 'hidden', height: '94%', width: '92%' }}>
      {/* Static Header for Ticker and Datetime */}
      <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          TA - {taData.ticker}
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {taData.interval}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {taData.timestamp}
        </Typography>
      </Box>

      {/* Horizontal Scroll for Datetime Header */}
      <Box
        sx={{ overflowX: 'auto', marginBottom: 1 }}
        ref={headerRef}
        onScroll={handleHorizontalScroll}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Indicator</TableCell>
                {timestamps.map((timestamp) => (
                  <TableCell key={timestamp}>
                    {timestamp}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>

      {/* Scrollable Indicators Table */}
      <Box
        sx={{ maxHeight: 700, overflowY: 'auto', border: '1px solid lightgray', borderRadius: 1 }}
        ref={bodyRef}
        onScroll={handleHorizontalScroll}
      >
        <TableContainer>
          <Table>
            <TableBody>
              {indicatorKeys.map((indicator) => (
                <TableRow key={indicator}>
                  <TableCell>{indicator}</TableCell>
                  {timestamps.map((timestamp) => (
                    <TableCell key={timestamp}>
                      {taData.indicators_list[timestamp][indicator] !== undefined
                        ? taData.indicators_list[timestamp][indicator]
                        : 'No data'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* CSV Button */}
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleDownloadCSV}>
          CSV
        </Button>
      </Box>
    </Paper>
  );
};

export default TAAnalyzeDisplay;