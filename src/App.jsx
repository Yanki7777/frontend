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
  baseUrl,
  HISTORICAL_PERIOD,
  AI_ENABLED,
  INTERVALS,
  DEFAULT_TICKER,
  DEFAULT_EXCHANGE,
  DEFAULT_SCREENER,
  ENABLE_ROTATOR,
  ENABLE_MARKET_AI,
}
  from './utils/config';

// console.log('baseUrl:', baseUrl, 'HISTORICAL_PERIOD:', HISTORICAL_PERIOD, 'AI_ENABLED:', AI_ENABLED, 'INTERVALS:', INTERVALS, 'DEFAULT_TICKER:', DEFAULT_TICKER, 'DEFAULT_EXCHANGE:', DEFAULT_EXCHANGE, 'DEFAULT_SCREENER:', DEFAULT_SCREENER);

import { getChartData } from './utils/ChartData';

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
  const [yfInfo, setYfInfo] = useState(null);
  const [fmpQuote, setFmpQuote] = useState(null);
  const [tickerRTData, setTickerRTData] = useState(null);
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
        // console.time('fmp-real-time-price');
        const realTimeDataResponse = await axios.post(`${baseUrl}/fmp-real-time-price`, { ticker, exchange });
        // console.timeEnd('fmp-real-time-price');
        setTickerRTData(realTimeDataResponse.data.stock_data);
        console.log('Fetched Real-Time Data:', realTimeDataResponse.data.stock_data);
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

      const [
        yfInfoResponse,
        fmpQuoteResponse,
        realTimeDataResponse,
        insiderTradingResponse,
        tradingViewAnalysisResponse1,
        tradingViewAnalysisResponse2,
        taAnalysisResponse1,
        taAnalysisResponse2,
        historicalResponse,
        newsSentimentResponse,
      ] = await Promise.all([
        axios.post(`${baseUrl}/yf-ticker-info`, { ticker }),
        axios.post(`${baseUrl}/fmp-quote`, { ticker }),
        // axios.post(`${baseUrl}/fmp-real-time-price`, { ticker, exchange }),
        axios.post(`${baseUrl}/ticker-insider-trading`, { ticker, type: 'all' }),
        axios.post(`${baseUrl}/tradingview_analyze_ticker`, { ticker, exchange, screener, tickerInterval: tickerInterval1, AI: AI_ENABLED }),
        axios.post(`${baseUrl}/tradingview_analyze_ticker`, { ticker, exchange, screener, tickerInterval: tickerInterval2, AI: AI_ENABLED }),
        axios.post(`${baseUrl}/ta-analyze-ticker`, { ticker, tickerInterval: tickerInterval1 }),
        axios.post(`${baseUrl}/ta-analyze-ticker`, { ticker, tickerInterval: tickerInterval2 }),
        axios.post(`${baseUrl}/historical-data`, { ticker, period: HISTORICAL_PERIOD }),
        axios.post(`${baseUrl}/news_sentiment`, { ticker }),
      ]);
      
      setYfInfo(yfInfoResponse.data.ticker_info);
      setFmpQuote(fmpQuoteResponse.data);
      setTickerRTData(realTimeDataResponse.data.stock_data);
      setInsiderTrading(insiderTradingResponse.data.insider_trading);
      setTradingViewAnalysis1(tradingViewAnalysisResponse1.data);
      setTradingViewAnalysis2(tradingViewAnalysisResponse2.data);
      setTAData1(taAnalysisResponse1.data);
      setTAData2(taAnalysisResponse2.data);
      setHistoricalPrices({
        data: historicalResponse.data.historical_data, period: HISTORICAL_PERIOD
      });
      setNewsSentiment(newsSentimentResponse.data);

      setShowTickerMenu(true); // Show the small ticker menu

    } catch (err) {
      setError(err.response?.data?.error || 'Analyze - Server error, please try again later.');
      setYfInfo(null);
      setFmpQuote(null);
      setTickerRTData(null);
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
      const response = await axios.get(`${baseUrl}/market_ai`);

      if (response.status === 200) {
        const marketAI = response.data;
        setMarketAI(marketAI);

        if (!marketAI) {
          setError('No Market AI at this time.');
        }
      } else {
        setError('Unexpected response status: ' + response.status);
      }
      setMarketAI(marketAI);

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
                    yfInfo={yfInfo}
                    sx={{ flex: 1 }}
                  />
                </Box>


                <Grid marginTop={2} lg={12} item xs={12} md={6}>
                  {yfInfo && fmpQuote && (
                    <TickerInfoDisplay
                      ticker={ticker}
                      yfInfo={yfInfo}
                      fmpQuote={fmpQuote}
                      tickerRTData={tickerRTData}
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
                <TickerChart
                  setHistoricalPrices={setHistoricalPrices}
                  chartData={chartData}
                  loading={tickerAnalysisLoading}
                  ticker={ticker}
                  sx={{ flex: 1 }}
                />
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