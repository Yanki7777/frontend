import React, { useState } from 'react';
import { Modal, Paper, Box, Typography, Switch, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function SettingsModal({ open, setOpen }) {
  const [enableAI, setEnableAI] = useState(false);
  const [enableDarkMode, setEnableDarkMode] = useState(false);
  const [userName, setUserName] = useState('');

  const handleSave = () => {
    // Save settings logic here
    console.log({ enableAI, enableDarkMode, userName });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="settings-modal-title"
      aria-describedby="settings-modal-description"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper 
        elevation={3} 
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          padding: '20px', 
          position: 'relative', 
          outline: 'none' 
        }}
      >
        <Box 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px' 
          }}
        >
          <Typography variant="h6" component="div">
            Settings
          </Typography>
          <IconButton 
            aria-label="close" 
            onClick={() => setOpen(false)} 
            style={{ 
              backgroundColor: '#f0f0f0', 
              borderRadius: '50%', 
              padding: '5px', 
              width: '30px',
                height: '30px',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box style={{ marginBottom: '20px' }}>
          <Typography variant="body1" component="div">
            Enable AI
          </Typography>
          <Switch
            checked={enableAI}
            onChange={(e) => setEnableAI(e.target.checked)}
          />
        </Box>
        <Box style={{ marginBottom: '20px' }}>
          <Typography variant="body1" component="div">
            Enable Dark Mode
          </Typography>
          <Switch
            checked={enableDarkMode}
            onChange={(e) => setEnableDarkMode(e.target.checked)}
          />
        </Box>
        <Box style={{ marginBottom: '20px' }}>
          <Typography variant="body1" component="div">
            User Name
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your user name"
          />
        </Box>
        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}

export default SettingsModal;