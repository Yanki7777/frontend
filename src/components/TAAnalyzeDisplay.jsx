import React from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button
} from '@mui/material';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const TAAnalyzeDisplay = ({ taData, loading }) => {

  const handleDownloadCSV = () => {
    if (taData && taData.full_indicators_list && Object.keys(taData.full_indicators_list).length > 0) {
      // Convert the dictionary to an array of arrays for CSV export
      const data = Object.entries(taData.full_indicators_list).map(([indicator, value]) => {
        // If the value is an object, flatten it into key-value pairs
        if (typeof value === 'object' && value !== null) {
          return {
            indicator,
            ...value  // Spread the properties of the value object into individual columns
          };
        } else {
          return { indicator, value };
        }
      });
  
      // Convert data to CSV format using PapaParse
      const csv = Papa.unparse(data);
      
      // Create a Blob from the CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      
      // Trigger the download using file-saver
      saveAs(blob, 'indicators_data.csv');
    } else {
      console.error("No data found or empty data in full_indicators_list");
    }
  };
  

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

  if (!taData) {
    return (
      <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center' }}>
        No analysis available.<br /> Analyze ticker to get analysis
      </Typography>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{ padding: 1, borderRadius: 2, position: 'relative', overflow: 'hidden', height: '94%', width: '92%' }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
        TA - {taData.ticker}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
        {taData.interval}
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>{taData.timestamp}</Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Indicator</TableCell>
              <TableCell>Last Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(taData.last_indicator_values).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CSV Button */}
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadCSV}
        >
          CSV
        </Button>
      </Box>
    </Paper>
  );
};

export default TAAnalyzeDisplay;
