import React, { useRef } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button
} from '@mui/material';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const TAAnalysisDisplay = ({ taData, loading }) => {

  const tableRef = useRef(null);

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
      <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          TA - {taData.ticker}
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {taData.interval}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Last: {taData.timestamp}
        </Typography>
      </Box>
      
      <Box
        sx={{ maxHeight: 800, overflow: 'auto', border: '1px solid lightgray', borderRadius: 1 }}
        ref={tableRef}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Indicator</TableCell>
                {taData.indicators_list.slice().reverse().map((data) => (
                  <TableCell key={data.timestamp}>
                    {data.timestamp}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(taData.indicators_list[0])
                .filter(indicator => indicator !== 'timestamp')
                .map((indicator) => (
                  <TableRow key={indicator}>
                    <TableCell>{indicator}</TableCell>
                    {taData.indicators_list.slice().reverse().map((dataPoint, index) => (
                      <TableCell key={index}>
                        {dataPoint[indicator] !== undefined ? dataPoint[indicator] : 'No data'}
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

export default TAAnalysisDisplay;