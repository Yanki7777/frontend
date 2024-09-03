// TickerModal.jsx
// Display the ticker history data of the TickerRotator in a modal
import React from 'react';
import { Modal, Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const formattedDateTime = (timestamp) => new Date(timestamp * 1000).toLocaleString('en-GB', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24-hour format
});

const TickerModal = ({ open, onClose, tickerData }) => {
    if (!tickerData) return null;

    return (
                <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="ticker-modal-title"
            aria-describedby="ticker-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
                    p: 4,
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'grey.500',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography id="ticker-modal-title" variant="h4" component="h2" gutterBottom>
                    {tickerData.ticker}
                </Typography>
                <Divider sx={{ width: '100%' }} />
                <Typography id="ticker-modal-description" variant="body1" sx={{ mt: 2 }}>
                    <strong>Price:</strong> {tickerData.price}
                </Typography>
                <Typography id="ticker-modal-description" variant="body1" sx={{ mt: 2 }}>
                    <strong>priceAvg50:</strong> {tickerData.priceAvg50}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Previous Close:</strong> {tickerData.previousClose}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Change:</strong> {tickerData.change} ({tickerData.changesPercentage}%)
                </Typography>                
                <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>At:</strong> {formattedDateTime(tickerData.timestamp)} EDT
                </Typography><Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Earnings Announcement:</strong> {new Date(tickerData.earningsAnnouncement).toLocaleDateString('en-GB')} 
                </Typography>
                
            </Box>
        </Modal>
    );
};

export default TickerModal;