import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Link, Divider, Menu, MenuItem, CircularProgress } from '@mui/material';
import './TickerInfo.css'; // Import the CSS file where we define the animation

function TickerInfo({ ticker, yfInfo, fmpQuote, tickerRTData, loading }) {
    const [flash, setFlash] = useState('');
    const [prevFmpLast, setPrevFmpLast] = useState(null);


    useEffect(() => {
        if (tickerRTData && tickerRTData.lastUpdated) {
            if (prevFmpLast !== null) {
                if (tickerRTData.fmpLast > prevFmpLast) {
                    setFlash('flash-green');
                } else if (tickerRTData.fmpLast < prevFmpLast) {
                    setFlash('flash-red');
                }
            }
            setPrevFmpLast(tickerRTData.fmpLast);

            // Remove the flash class after the animation ends
            const timer = setTimeout(() => {
                setFlash('');
            }, 1400); // Duration of the flash effect

            return () => clearTimeout(timer);
        }
    }, [tickerRTData.lastUpdated, tickerRTData.fmpLast, prevFmpLast]);

    if (!yfInfo || !fmpQuote) {
        return (
            <Paper elevation={3} sx={{ padding: 2 }}>
                No yfInfo or fmpQuote available.
            </Paper>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

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

    return (
        <Paper
            elevation={6}
            sx={{
                padding: 1,
                borderRadius: 2,
                backgroundColor: '#f0f4f8',
                color: '#333',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                maxWidth: 650,
                margin: 'auto',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >


            <Box sx={{
                backgroundColor: '#e0e0e0', // Updated to lighter gray color
                padding: 3,
                borderRadius: 2,
                transition: 'background 0.3s ease-in-out',
            }}>
                <Typography variant="h3" component="h3" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold', textAlign: 'center' }}>
                    {yfInfo.shortName}
                </Typography>
                <Typography
                    variant="body1"
                    className={flash} // Apply the flash class conditionally
                    sx={{ fontSize: '2.2rem', marginBottom: 0, textAlign: 'center' }}
                >
                    <strong>Price: </strong>{tickerRTData.fmpLast.toFixed(2)} <br />
                </Typography>
                <Typography
                    variant="body1"
                    className={flash} // Apply the flash class conditionally
                    sx={{ fontSize: '1.0rem', marginBottom: 1, textAlign: 'center' }}
                >
                    <strong>At: </strong>{formattedDateTime(tickerRTData.lastUpdated / 1000)} <br />
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.5rem', marginBottom: 1, textAlign: 'center' }}>
                    <strong>Analyst: </strong>{yfInfo.recommendationKey} {yfInfo.recommendationMean}
                </Typography>

                <Divider sx={{ my: 2, borderColor: '#2e7d32' }} />

                <Typography variant="h6" component="p" sx={{ fontWeight: 'semi-bold', marginBottom: 1, textAlign: 'center' }}>
                    fmp-quote
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.3rem', marginBottom: 1, textAlign: 'center' }}>
                    <strong>Price: </strong>{fmpQuote.fmp_quote.price}
                    <br />
                    <strong>Change: </strong>{fmpQuote.fmp_quote.change} ({fmpQuote.fmp_quote.changesPercentage.toFixed(2)}%)
                    <br />
                    <strong>At: </strong>{formattedDateTime(fmpQuote.fmp_quote.timestamp)}
                </Typography>

                <Typography variant="body1" sx={{ fontSize: '1.3rem', marginBottom: 1, textAlign: 'center' }}>
                    <strong>Price: </strong>{yfInfo.regularMarketPreviousClose}
                    <strong> | Bid: </strong>{yfInfo.bid}
                    <strong> | Ask: </strong>{yfInfo.ask}
                </Typography>

                <Divider sx={{ my: 2, borderColor: '#2e7d32' }} />
                <Typography variant="body1" sx={{ fontSize: '1.2rem', marginBottom: 1, textAlign: 'center' }}>
                    <strong>Website: </strong>
                    <Link href={yfInfo.website} target="_blank" rel="noopener noreferrer" sx={{ color: '#1e88e5', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {yfInfo.website}
                    </Link>
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', marginBottom: 1, textAlign: 'center' }}>
                    <strong>Industry: </strong>{yfInfo.industry}
                    <br />
                    <strong>Sector: </strong>{yfInfo.sector}
                    <br />
                    <strong>MarketCap (B): </strong>{(yfInfo.marketCap / 1000000000).toFixed(3)}
                    <br />
                    <strong>Target Median Price: </strong>{yfInfo.targetMedianPrice}
                    <br />
                    <strong>Trailing PE: </strong>{yfInfo.trailingPE}
                    <br />
                    <strong>Forward PE: </strong>{yfInfo.forwardPE}
                </Typography>

            </Box>
        </Paper>
    );
}

export default TickerInfo;
