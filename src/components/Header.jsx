import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem,
  Button, Avatar, Tooltip, Container, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { YAnalisysVersion, baseUrl } from '../utils/config';
import About from './About';
import { Snackbar } from '@mui/material';
const leftPages = []; // Reserved for future use
const rightPages = ['Markets AI', 'Trade Settings', 'About'];
const user_settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Header = ({ getMarketAI, loading, selectedUniverse }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isTradeSettingsDialogOpen, setIsTradeSettingsDialogOpen] = useState(false);
  const [isInsiderDialogOpen, setIsInsiderDialogOpen] = useState(false);
  const [nasdaqStatus, setNasdaqStatus] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  // Toggle navigation menu
  const handleNavMenuToggle = (event) => {
    setAnchorElNav(prev => prev ? null : event.currentTarget);
  };

  // Toggle user menu
  const handleUserMenuToggle = (event) => {
    setAnchorElUser(prev => prev ? null : event.currentTarget);
  };

  // Toggle Trade Settings dialog
  const handleTradeSettingsDialogToggle = () => {   
    setIsTradeSettingsDialogOpen(prev => !prev);
    setIsSnackbarOpen(true); // Show the Snackbar
  };

  // Toggle Insider Trading dialog
  const handleInsiderDialogToggle = () => {
    setIsInsiderDialogOpen(prev => !prev);
  };

  // Event handler for navigation buttons
  const handlePageClick = (page) => {
    setAnchorElNav(null); // Close the navigation menu
    switch (page) {
      case 'Trade Settings':
        handleTradeSettingsDialogToggle();
        break;
      case 'Markets AI':
        getMarketAI(); // Trigger the Market AI functionality
        break;
      case 'About':   
        About({ YAnalisysVersion }); // Open the About popup
        break;
      default:
        break;
    }
  };

  
  // Fetch NASDAQ status periodically
  useEffect(() => {
    const fetchNasdaqStatus = async () => {
      try {
        const response = await axios.get(`${baseUrl}/nasdaq-status`);
        if (response.status === 200) {
          const status = response.data;
          setNasdaqStatus(status.nasdaq_open ? 'Open' : 'Closed');
        } else {
          console.error('Error fetching NASDAQ status:', response);
        }
      } catch (error) {
        console.error('Error fetching NASDAQ status:', error);
        setNasdaqStatus('Unavailable');
      }
    };

    fetchNasdaqStatus(); // Fetch immediately
    const interval = setInterval(fetchNasdaqStatus, 60000); // Fetch every minute
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2c3e50', marginBottom: '20px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#ecf0f1',
                textDecoration: 'none',
                flexGrow: 1,  // Allow the typography to grow and take up available space
              }}
            >
              Y Analysis
            </Typography>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '30px',
              }}
            >
              {rightPages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    if (page === 'Trade Settings') handleTradeSettingsDialogToggle();
                    else handlePageClick(page);
                  }}
                  variant="contained"
                  sx={{ color: '#ecf0f1', margin: 1, cursor: 'pointer', width: '200px' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Display NASDAQ status */}
          <Box sx={{ flexGrow: 0, marginRight: '20px', marginLeft: '20px' }}>
            <Typography
              variant="body1"
              sx={{
                color: nasdaqStatus === 'Open' ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              NASDAQ {nasdaqStatus}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open user settings">
              <IconButton onClick={handleUserMenuToggle} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleUserMenuToggle}
            >
              {user_settings.map((setting) => (
                <MenuItem key={setting} onClick={handleUserMenuToggle}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={3000} // Snackbar will auto-hide after 3 seconds
          onClose={() => setIsSnackbarOpen(false)}
          message="Trade settings will be here soon"
        />
      </Container>


    </AppBar>
  );
};

export default Header;
