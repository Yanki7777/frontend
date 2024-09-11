import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../utils/config';
import './TickerRotator.css';
import TickerModal from './TickerModal';
import {getQuote} from "../api"

const rTickers = ['SPY', 'QQQ', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'GBTC', 'ETHE', 'BTC-USD', 'ETH-USD'];

const fetchStockData = async (ticker) => {
    try {
        // const response = await axios.post(`${baseUrl}/fmp-quote`, { ticker });
        console.log("Start get quote")
        const response = await getQuote(ticker);
        console.log(response)
        const { price, change, changesPercentage, previousClose, priceAvg50, timestamp, earningsAnnouncement } = response;

        return {
            ticker,
            price: price.toFixed(2),
            change: change.toFixed(2),
            changesPercentage: changesPercentage.toFixed(2),
            previousClose: previousClose.toFixed(2),
            priceAvg50: priceAvg50.toFixed(2),
            timestamp: timestamp,
            earningsAnnouncement: earningsAnnouncement,
        };
    } catch (error) {
        console.error(`Error fetching stock data for ${ticker}:`, error);
        return {
            ticker,
            price: "N/A",
            change: "N/A",
            changesPercentage: "N/A",
            previousClose: "N/A",
            priceAvg50: "N/A",
            timestamp: "N/A",
            earningsAnnouncement: "N/A"
        };
    }
};

const getPriceColor = (price, previousClose) => {
    if (price === "N/A" || previousClose === "N/A") return '#ffffff';
    return price > previousClose ? '#00ff00' : price < previousClose ? '#ff4040' : '#ffffff';
};

const TickerRotator = () => {
    const [stockData, setStockData] = useState({});
    const previousDataRef = useRef({});
    const [flashTicker, setFlashTicker] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTickerData, setSelectedTickerData] = useState(null);

    useEffect(() => {
        const updateStockData = async () => {
            const newStockData = {};

            for (let ticker of rTickers) {
                newStockData[ticker] = await fetchStockData(ticker);

                if (
                    previousDataRef.current[ticker] &&
                    (
                        newStockData[ticker].price !== previousDataRef.current[ticker].price ||
                        newStockData[ticker].changesPercentage !== previousDataRef.current[ticker].changesPercentage
                    )
                ) {
                    setFlashTicker(ticker);
                    setTimeout(() => setFlashTicker(null), 500);
                }
            }

            previousDataRef.current = newStockData;
            setStockData(newStockData);
        };

        updateStockData();
        const intervalId = setInterval(updateStockData, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const handleTickerClick = (ticker) => {
        setSelectedTickerData(stockData[ticker]);
        setModalOpen(true);
    };

    const renderTickerBox = (ticker) => {
        const data = stockData[ticker];
        const priceColor = getPriceColor(data?.price, data?.previousClose);
        const isFlashing = flashTicker === ticker;

        return (
            <Box
                key={ticker}
                sx={{
                    margin: '0 20px',
                    textAlign: 'center',
                    minWidth: '100px',
                    animation: isFlashing ? 'flash 0.5s ease' : 'none',
                    cursor: 'pointer',
                }}
                onClick={() => handleTickerClick(ticker)}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: priceColor,
                    }}
                >
                    {ticker}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    Price: {data?.price || 'Loading...'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    Change: {data?.changesPercentage || 'Loading...'}%
                </Typography>
            </Box>
        );
    };

    return (
        <Box sx={{ backgroundColor: '#1c2833', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
                {rTickers.map(renderTickerBox)}
            </Box>

            <TickerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                tickerData={selectedTickerData}
            />
        </Box>
    );
};

export default TickerRotator;
