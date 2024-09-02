import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import marketBackground from '../utils/markets.png';

console.log('Image path:', marketBackground); // Debugging step

const Chat = ({ handleChat, loading }) => (
  <Paper
    elevation={3}
    sx={{ padding: 2, height: '94%', position: 'relative', overflow: 'hidden' }}
    style={{ position: 'relative' }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${marketBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.18,
		zIndex: 3,
      }}
    />
    <Typography
      variant="h4"
      gutterBottom
      sx={{ color: 'black', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
    >
      Chat
    </Typography>
    {/* Add other elements here */}
  </Paper>
);

export default Chat;