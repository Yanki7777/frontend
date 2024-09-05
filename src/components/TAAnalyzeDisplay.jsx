import React from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress,
} from '@mui/material';



const TAAnalyzeDisplay = ({ taData, loading }) => {

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
      sx={{ padding: 1, borderRadius: 2, position: 'relative', overflow: 'hidden', height: '94%', width: '92%' }}>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
        TA - {taData.ticker}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>{taData.interval}</Typography>
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
    </Paper>

  );
};

export default TAAnalyzeDisplay;
