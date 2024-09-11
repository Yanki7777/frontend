// App.jsx 

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Box, Alert, Grid, Paper, } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';

// components
import Header from './components/Header';
import VolatilityBox from './components/VolatilityBox';
import FearAndGreed from './components/FearAndGreed';
import SelectUniverse from './components/SelectUniverse';
import BuildPortfolio from './components/BuildPortfolio';
import AnalyzeTickerForm from './components/AnalyzeTickerForm';
import TickerChart from './components/TickerChart';
import NewsSentiment from './components/NewsSentiment';
import InsiderTrading from './components/InsiderTrading';
import TVFullAnalysisDisplay from './components/TVFullAnalysisDisplay';
import TickerInfoDisplay from './components/TickerInfoDisplay';
import Trade from './components/Trade';
import TickerRotator from './components/TickerRotator';
import MarketAIDisplay from './components/MarketAIDisplay';
import TVAnalysisDisplay from './components/TVAnalysisDisplay';
import TAAnalysisDisplay from './components/TAAnalysisDisplay';

//utils
import {

  HISTORICAL_PERIOD,
  AI_ENABLED,
  INTERVALS,
  DEFAULT_TICKER,
  DEFAULT_EXCHANGE,
  DEFAULT_SCREENER,
  ENABLE_ROTATOR,
}
  from './utils/config';

import { getChartData } from './utils/ChartData';
import { getMarketAI, getRealTimePrice, getTickerVolatility } from './api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


function App() {

  const [ticker, setTicker] = useState(DEFAULT_TICKER);
  const [exchange, setExchange] = useState(DEFAULT_EXCHANGE);
  const [screener, setScreener] = useState(DEFAULT_SCREENER);
  const [tickerInterval1, setTickerInterval1] = useState(INTERVALS.SHORT);
  const [tickerInterval2, setTickerInterval2] = useState(INTERVALS.LONG);
  const [tickerInfo, setTickerInfo] = useState(null);
  const [quote, setQuote] = useState(null);
  const [tickerRealTimeData, setTickerRealTimeData] = useState(null);
  const [insiderTrading, setInsiderTrading] = useState(null);
  const [tradingViewAnalysis1, setTradingViewAnalysis1] = useState(null);
  const [tradingViewAnalysis2, setTradingViewAnalysis2] = useState(null);
  const [taData1, setTAData1] = useState(null);
  const [taData2, setTAData2] = useState(null);
  const [historicalPrices, setHistoricalPrices] = useState(null);
  const [newsSentiment, setNewsSentiment] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioInterval1, setPortfolioInterval1] = useState(INTERVALS.SHORT);
  const [portfolioInterval2, setPortfolioInterval2] = useState(INTERVALS.LONG);
  const [selectedUniverse, setSelectedUniverse] = useState(null);
  const [showTickerMenu, setShowTickerMenu] = useState(false);

  const [chartData, setChartData] = useState(null);
  const [marketAI, setMarketAI] = useState(null);

  const [loading, setLoading] = useState(false);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [marketAiLoading, setMarketAiLoading] = useState(false);
  const [tickerAnalysisLoading, setTickerAnalysisLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (historicalPrices) {
      setChartData(getChartData(historicalPrices, ticker));
    }
  }, [historicalPrices]);

  useEffect(() => {
    handleMarketAI();
  }, []);  // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    setPortfolio(null);
  }, [selectedUniverse]);


  // --------------------- realtime data ---------------------
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const realTimeData = await getRealTimePrice(ticker, exchange);
        setTickerRealTimeData(realTimeData);
      } catch (err) {
        console.error('Error fetching real-time data:', err);
        setError('Failed to fetch real-time ticker data.');
      }
    };

    fetchRealTimeData(); // Fetch immediately when the component mounts

    const intervalId = setInterval(() => {
      fetchRealTimeData();
    }, 60000); // Fetch every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [ticker]); // Dependency array ensures it runs when the ticker changes


  // ---------------- handleAnalyze ----------------  
  const handleAnalyze = async (e) => {
    if (!ticker.trim()) {
      setError('Ticker is required');
      return;
    }

    setTickerAnalysisLoading(true);
    setError(null); // Clear previous errors

    try {
      const tickerInfo = await getTickerInfo(ticker)
      console.log(tickerInfo)
      setTickerInfo(tickerInfo);

      const quote = await getQuote(ticker)
      setQuote(quote);

      const realTimeData = await getRealTimePrice(ticker, exchange)
      setTickerRealTimeData(realTimeData);

      const tvAnalysis1 = await getTechnicalAnalysisTv(ticker, exchange, screener, tickerInterval1, AI_ENABLED)
      setTradingViewAnalysis1(tvAnalysis1);

      const tvAnalysis2 = await getTechnicalAnalysisTv(ticker, exchange, screener, tickerInterval2, AI_ENABLED)
      setTradingViewAnalysis2(tvAnalysis2);

      const taData1 = await getTechnicalAnalysis(ticker, tickerInterval1)
      setTAData1(taData1);

      const taData2 = await getTechnicalAnalysis(ticker, tickerInterval2)
      setTAData2(taData2);

      const historicalData = await getHistoricalData(ticker, HISTORICAL_PERIOD)
      setHistoricalPrices(historicalData);

      const newsSentiment = await getNewsSentiment(ticker)
      setNewsSentiment(newsSentiment);

      setShowTickerMenu(true); // Show the small ticker menu

    } catch (err) {
      setError(err.response?.data?.error || 'Analyze - Server error, please try again later.');
      setTickerInfo(null);
      setQuote(null);
      setTickerRealTimeData(null);
      setTradingViewAnalysis1(null);
      setTradingViewAnalysis2(null);
      setTAData1(null);
      setTAData2(null);
      setHistoricalPrices(null);
      setNewsSentiment(null);
    } finally {
      setTickerAnalysisLoading(false);
    }
  };

  const handleMarketAI = async () => {
    setMarketAiLoading(true);
    setError(null);
    try {
      const response = await getMarketAI()
      setMarketAI(response);
    } catch (err) {
      console.error('Error getting Market AI', err);
      setError('Failed to retrieve Market AI', err);
      setMarketAI(null);
    } finally {
      setMarketAiLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ marginTop: 3 }}>

        <Header getMarketAI={handleMarketAI} loading={loading} selectedUniverse={selectedUniverse} />
        <Grid container spacing={2}>
          {ENABLE_ROTATOR && (
            <Grid item xs={10}>
              <TickerRotator />
            </Grid>
          )}
          <Grid item xs={2}>
            <FearAndGreed />
          </Grid>
        </Grid>



        <div className='mainWrapper'>
          <Grid container spacing={2}>
            <Grid item lg={2} xs={12} md={1}>
              <Box height="100%">
                <SelectUniverse
                  selectedUniverse={selectedUniverse}
                  setTicker={setTicker}
                  setExchange={setExchange}
                  setSelectedUniverse={setSelectedUniverse}
                  handleAnalyze={handleAnalyze}
                />
              </Box>
            </Grid>
            <Grid item lg={4} xs={12} md={1}>
              <Box height="100%">
                <BuildPortfolio
                  portfolio={portfolio}
                  setPortfolio={setPortfolio}
                  loading={portfolioLoading}
                  setPortfolioLoading={setPortfolioLoading}
                  selectedUniverse={selectedUniverse}
                  setPortfolioInterval1={setPortfolioInterval1}
                  portfolioInterval1={portfolioInterval1}
                  setPortfolioInterval2={setPortfolioInterval2}
                  portfolioInterval2={portfolioInterval2}
                />
              </Box>
            </Grid>
            <Grid item lg={3} xs={12} md={1}>
              <Box height="100%">
                <Trade
                  portfolio={portfolio}
                  loading={portfolioLoading}
                  setTicker={setTicker}
                  setExchange={setExchange}
                  handleAnalyze={handleAnalyze}
                />
              </Box>
            </Grid>
            <Grid item lg={3} xs={12} md={6}>
              <Box height="100%">
                <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                  <Grid container spacing={2}>

                    <Grid item xs={12}>
                      <VolatilityBox />
                    </Grid>
                  </Grid>
                </Paper>

                <MarketAIDisplay
                  marketAI={marketAI}
                  handleMarketAI={handleMarketAI}
                  loading={marketAiLoading}
                />
              </Box>
            </Grid>

          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={2}>
              <Grid item lg={12} xs={12} md={6}>
                <Box display="flex">
                  <AnalyzeTickerForm
                    ticker={ticker}
                    setTicker={setTicker}
                    exchange={exchange}
                    setExchange={setExchange}
                    screener={screener}
                    setScreener={setScreener}
                    tickerInterval1={tickerInterval1}
                    setTickerInterval1={setTickerInterval1}
                    tickerInterval2={tickerInterval2}
                    setTickerInterval2={setTickerInterval2}
                    loading={tickerAnalysisLoading}
                    handleAnalyze={handleAnalyze}
                    showTickerMenu={showTickerMenu}
                    error={error}
                    yfInfo={tickerInfo}
                    sx={{ flex: 1 }}
                  />
                </Box>


                <Grid marginTop={2} lg={12} item xs={12} md={6}>
                  {tickerInfo && quote && (
                    <TickerInfoDisplay
                      ticker={ticker}
                      yfInfo={tickerInfo}
                      fmpQuote={quote}
                      tickerRTData={tickerRealTimeData}
                      loading={tickerAnalysisLoading}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid lg={1} item xs={12} md={4}>
              <Box display="flex" height="100%">
                <Paper elevation={3} sx={{ padding: 2, width: '100%', justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <TVAnalysisDisplay loading={tickerAnalysisLoading} tradingViewAnalysis={tradingViewAnalysis1} />
                </Paper>
              </Box>
            </Grid>
            <Grid lg={1} item xs={12} md={4}>
              <Box display="flex" height="100%">
                <Paper elevation={3} sx={{ padding: 2, width: '100%', justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <TVAnalysisDisplay loading={tickerAnalysisLoading} tradingViewAnalysis={tradingViewAnalysis2} />
                </Paper>
              </Box>
            </Grid>
            <Grid lg={2} item xs={12} md={4}>
              <Box display="flex" height="100%">
                <Paper elevation={3} sx={{ padding: 2, width: '100%', justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <TAAnalysisDisplay loading={tickerAnalysisLoading} taData={taData1} />
                </Paper>
              </Box>
            </Grid>
            <Grid lg={2} item xs={12} md={4}>
              <Box display="flex" height="100%">
                <Paper elevation={3} sx={{ padding: 2, width: '100%', justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <TAAnalysisDisplay loading={tickerAnalysisLoading} taData={taData2} />
                </Paper>
              </Box>
            </Grid>
            <Grid item lg={4} xs={12} md={6}>
              <Box display="flex" height="100%">
                {/* <TickerChart
                  setHistoricalPrices={setHistoricalPrices}
                  chartData={chartData}
                  loading={tickerAnalysisLoading}
                  ticker={ticker}
                  sx={{ flex: 1 }}
                /> */}
              </Box>
            </Grid>
          </Grid>
        </div>
        <Grid container spacing={2}>
          <Grid item lg={4} xs={12} md={1}>
            {tradingViewAnalysis1 && (
              <Box flex={1}>
                <TVFullAnalysisDisplay tradingViewAnalysis={tradingViewAnalysis1} loading={tickerAnalysisLoading} />
              </Box>
            )}
          </Grid>
          <Grid item lg={4} xs={12} md={1}>
            {tradingViewAnalysis2 && (
              <Box flex={1}>
                <TVFullAnalysisDisplay tradingViewAnalysis={tradingViewAnalysis2} loading={tickerAnalysisLoading} />
              </Box>
            )}
          </Grid>
          <Grid item lg={2} xs={12} md={1}>
            {insiderTrading && (
              <Box flex={1}>
                <InsiderTrading insiderTrading={insiderTrading} ticker={ticker} loading={tickerAnalysisLoading} />
              </Box>
            )}
          </Grid>
          <Grid item lg={2} xs={12} md={1}>
            {newsSentiment && (
              <Box flex={1}>
                <NewsSentiment newsSentiment={newsSentiment} ticker={ticker} loading={tickerAnalysisLoading} />
              </Box>
            )}
          </Grid>
        </Grid>
        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}
      </Container >
    </>
  );
}

export default App;