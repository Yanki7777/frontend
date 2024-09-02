import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../utils/config';

const rTickers = ['SPY', 'QQQ', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'GBTC', 'ETHE', 'BTC-USD', 'ETH-USD'];

const fetchTickerPrice = async (ticker) => {
    try {
        const response = await axios.post(`${baseUrl}/fmp-quote`, { ticker });
        const { price, change, changesPercentage, previousClose } = response.data.fmp_quote;

        return {
            price: price.toFixed(2),
            change: change.toFixed(2),
            changesPercentage: changesPercentage.toFixed(2),
            previousClose: previousClose.toFixed(2)
        };
    } catch (error) {
        console.error(`Error fetching ticker price for ${ticker}:`, error);
        return {
            price: "N/A",
            change: "N/A",
            changesPercentage: "N/A",
            previousClose: "N/A"
        };
    }
};

const TickerRotator = () => {
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const updatePrices = async () => {
            const newPrices = {};

            for (let ticker of rTickers) {
                newPrices[ticker] = await fetchTickerPrice(ticker);
            }

            setPrices(newPrices);
        };

        updatePrices();

        const intervalId = setInterval(updatePrices, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box sx={{ backgroundColor: '#1c2833', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
                {rTickers.map((ticker) => (
                    <Box key={ticker} sx={{ margin: '0 20px', textAlign: 'center', minWidth: '100px' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color:
                                    prices[ticker]?.price !== "N/A" &&
                                    prices[ticker]?.previousClose !== "N/A" &&
                                    prices[ticker]?.price > prices[ticker]?.previousClose
                                        ? '#00ff00' // Bright green for increase
                                        : prices[ticker]?.price !== "N/A" &&
                                          prices[ticker]?.previousClose !== "N/A" &&
                                          prices[ticker]?.price < prices[ticker]?.previousClose
                                            ? '#ff4040' // Bright red for decrease
                                            : '#ffffff', // White for no change or loading
                            }}
                        >
                            {ticker}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#ffffff' }}
                        >
                            Price: {prices[ticker]?.price || 'Loading...'}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#ffffff' }}
                        >
                            Change: {prices[ticker]?.changesPercentage || 'Loading...'}%
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TickerRotator;
