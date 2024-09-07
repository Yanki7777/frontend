import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, Box } from '@mui/material';
import { baseUrl } from '../utils/config';

const Gauge = ({ value }) => {
  const needleStyle = {
    transform: `rotate(${(value / 100) * 180 - 90}deg)`,
    transformOrigin: 'bottom center',
    transition: 'transform 0.5s ease-out',
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100px',
        height: '30px',
      }}
    >
      <svg viewBox="0 0 100 50" width="100%" height="100%">
        <path
          d="M10 45 A40 40 0 0 1 90 45"
          fill="none"
          stroke="#ddd"
          strokeWidth="8"
        />
        <path
          d="M10 45 A40 40 0 0 1 90 45"
          fill="none"
          stroke={
            value < 25
              ? '#f44336'
              : value < 50
              ? '#ff9800'
              : value < 75
              ? '#2196f3'
              : '#4caf50'
          }
          strokeWidth="8"
          strokeDasharray={`${(value / 100) * 180}, 180`}
        />
        <circle cx="50" cy="45" r="4" fill="#333" />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          width: '2px',
          height: '40px',
          backgroundColor: '#fff',
          left: '50%',
          bottom: '0',
          ...needleStyle,
        }}
      />
    </Box>
  );
};

const FearAndGreed = () => {
  const [gafIndex, setGafIndex] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGafIndex = async () => {
      try {
        const response = await axios.get(`${baseUrl}/fear_and_greed`);

        if (response.status === 200) {
          const data = response.data;
          setGafIndex(data.gafIndex);
          setLastUpdate(data.lastUpdate);  
        } else {
          setError('Unexpected response status: ' + response.status);
        }
      } catch (err) {
        console.error('Error Getting G&F index:', err);
        setError('Failed to retrieve Fear and Greed index. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGafIndex();
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{
        backgroundColor: '#1c2833',
        padding: 1,
        textAlign: 'center',
        margin: '0 auto',
        color: '#fff',        
        mb: 2, 
      }}
      
    >
      {loading ? (
        <Typography variant="body2">Loading...</Typography>
      ) : error ? (
        <Typography variant="body2" color="error">{error}</Typography>
      ) : (
        <>
          <Typography variant="body2">
            Fear and Greed Index: {gafIndex !== null ? gafIndex : 'N/A'}          
          </Typography>
          {lastUpdate && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {lastUpdate}
          </Typography>
        )}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Gauge value={gafIndex !== null ? gafIndex : 0} />
          </Box>
        </>
      )}
    </Paper>
  );
  
};

export default FearAndGreed;
