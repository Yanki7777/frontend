import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem,
  Button, Avatar, Tooltip, Container, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { YAnalisysVersion, baseUrl } from '../utils/config';
import UniInsiderTrading from './UniInsiderTrading';
import About from './About';

const leftPages = []; // Reserved for future use
const rightPages = ['Insiders', 'Markets AI', 'Trade Settings', 'About'];
const user_settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Header = ({ getMarketAI, loading, selectedUniverse }) => {
  // console.log('Header component rendered!', loading, selectedUniverse);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isTradeSettingsDialogOpen, setIsTradeSettingsDialogOpen] = useState(false);
  const [isInsiderDialogOpen, setIsInsiderDialogOpen] = useState(false);
  const [nasdaqStatus, setNasdaqStatus] = useState(null);

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
  };

  // Toggle Insider Trading dialog
  const handleInsiderDialogToggle = () => {
    setIsInsiderDialogOpen(prev => !prev);
  };

  // Event handler for navigation buttons
  const handlePageClick = (page) => {
    setAnchorElNav(null); // Close the navigation menu
    switch (page) {
      case 'Insiders':
        handleInsiderDialogToggle(); // Toggle the Insiders dialog
        break;
      case 'Markets AI':
        getMarketAI(); // Trigger the Market AI functionality
        break;
      case 'About':
        console.log('About clicked');
        About({ YAnalisysVersion }); // Open the About popup
        break;
      default:
        break;
    }
  };

  const openAboutPopup = useCallback(({ YAnalisysVersion }) => {
    const width = 600;
    const height = 480;
    const left = (window.outerWidth / 2) + window.screenX - (width / 2);
    const top = (window.outerHeight / 2) + window.screenY - (height / 2);
    const aboutWindow = window.open(
      '',
      'About Y Analysis',
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars=yes`
    );

    aboutWindow.document.write(`
      <html>
        <head>
          <title>About Y Analysis</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #2c3e50; color: #ecf0f1; padding: 20px; margin: 0; box-sizing: border-box; }
            h1 { color: #ecf0f1; font-size: 24px; margin-bottom: 10px; }
            p { color: #bdc3c7; font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
            .footer { color: #ecf0f1; font-size: 14px; text-align: center; margin-top: 20px; border-top: 1px solid #7f8c8d; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>About Y Analysis</h1>
          <p>Y Analysis is a cutting-edge financial tool designed to empower users with state-of-the-art market analysis, AI-driven insights, and real-time internet research.</p>
          <p>Our platform leverages advanced artificial intelligence algorithms to provide deep market analysis, enabling users to build and manage portfolios with precision.</p>
          <p>With Y Analysis, you can engage with portfolios using the latest research tools, drawing on real-time data to make informed trading decisions in a dynamic market environment.</p>
          <p>Version: ${YAnalisysVersion}</p>
          <p>Developed by: Y</p>
          <div class="footer">&copy; 2024 Y Analysis. All rights reserved.</div>
        </body>
      </html>
    `);
  }, []);

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
      </Container>

      {/* Insider Trading Dialog */}
      <Dialog
        open={isInsiderDialogOpen}
        onClose={handleInsiderDialogToggle}
        maxWidth="lg" // Adjust the max width to make it wider (options: 'xs', 'sm', 'md', 'lg', 'xl')
        fullWidth // Ensures the dialog takes the full width as defined by maxWidth
        sx={{ '& .MuiDialog-paper': { width: '55%', maxWidth: 'none' } }} // Further customize the width
      >
        <DialogTitle sx={{ fontSize: '2.5rem', textAlign: 'center'}}>
          Universe Insider Buying (upto 3 months)
          <IconButton
            aria-label="close"
            onClick={handleInsiderDialogToggle}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ fontSize: '1.5rem' }}>
          <UniInsiderTrading selectedUniverse={selectedUniverse} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInsiderDialogToggle} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
