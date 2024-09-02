// App component is the main component that renders all the other components
// It also manages the state of the application
// It uses the useState and useEffect hooks to manage state and side effects
// It uses the axios library to make HTTP requests to the backend server
// It uses the Chart.js library to render the historical prices chart 
// It uses the Material-UI library to render the user interface

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// components
import Header from './components/Header';
import SpyVolatility from './components/SpyVolatility';
import FearAndGreed from './components/FearAndGreed';
import SelectUniverse from './components/SelectUniverse';
import BuildPortfolio from './components/BuildPortfolio';
import AnalyzeTickerForm from './components/AnalyzeTickerForm';
import HistoricalPricesChart from './components/HistoricalPricesChart';
import NewsSentiment from './components/NewsSentiment';
import InsiderTrading from './components/InsiderTrading';
import TechAnalysisResult from './components/DetailedTechAnalysis';
import TickerInfo from './components/TickerInfo';
import Trade from './components/Trade';
import MarketAI from './components/MarketAI';
//import Chat from './components/Chat';
import ChatComponent from './components/ChatComponent';
import AnalysisSummary from './components/AnalysisSummary';



//utils
import { baseUrl } from './utils/config';
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

  const [ticker, setTicker] = useState('SPY');
  const [exchange, setExchange] = useState('AMEX');
  const [screener, setScreener] = useState('America');
  const [tickerInterval1, setTickerInterval1] = useState('15m');
  const [tickerInterval2, setTickerInterval2] = useState('1d');
  const [yfInfo, setYfInfo] = useState(null);
  const [fmpQuote, setFmpQuote] = useState(null);
  const [tickerRTData, setTickerRTData] = useState(null);
  const [insiderTrading, setInsiderTrading] = useState(null);
  const [techAnalysisResult1, setTechAnalysisResult1] = useState(null);
  const [techAnalysisResult2, setTechAnalysisResult2] = useState(null);
  const [historicalPrices, setHistoricalPrices] = useState(null);
  const [newsSentiment, setNewsSentiment] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioInterval1, setPortfolioInterval1] = useState('15m');
  const [portfolioInterval2, setPortfolioInterval2] = useState('1d');
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
        techAnalysisResponse1,
        techAnalysisResponse2,
        historicalResponse,
        newsSentimentResponse,
      ] = await Promise.all([
        axios.post(`${baseUrl}/yf-ticker-info`, { ticker }),
        axios.post(`${baseUrl}/fmp-quote`, { ticker }),
        axios.post(`${baseUrl}/fmp-real-time-price`, { ticker, exchange }),
        axios.post(`${baseUrl}/ticker-insider-trading`, { ticker, type: 'all' }),
        axios.post(`${baseUrl}/tech_analyze_ticker`, { ticker, exchange, screener, tickerInterval: tickerInterval1 }),
        axios.post(`${baseUrl}/tech_analyze_ticker`, { ticker, exchange, screener, tickerInterval: tickerInterval2 }),
        axios.post(`${baseUrl}/historical_data`, { ticker, period: "10y" }),
        axios.post(`${baseUrl}/news_sentiment`, { ticker }),
      ]);

      setYfInfo(yfInfoResponse.data.ticker_info);
      setFmpQuote(fmpQuoteResponse.data);
      setTickerRTData(realTimeDataResponse.data.stock_data);
      setInsiderTrading(insiderTradingResponse.data.insider_trading);
      setTechAnalysisResult1(techAnalysisResponse1.data);
      setTechAnalysisResult2(techAnalysisResponse2.data);
      setHistoricalPrices({
        data: historicalResponse.data.historical_data, period: "10y"
      });
      setNewsSentiment(newsSentimentResponse.data);

      setShowTickerMenu(true); // Show the small ticker menu

    } catch (err) {
      setError(err.response?.data?.error || 'Analyze - Server error, please try again later.');
      setYfInfo(null);
      setFmpQuote(null);
      setTickerRTData(null);
      setTechAnalysisResult1(null);
      setTechAnalysisResult2(null);
      setHistoricalPrices(null);
      setNewsSentiment(null);
    } finally {
      setTickerAnalysisLoading(false);
    }
  };


  // To be developed
  const handleTrade = async () => {
    setLoading(true);
    setError(null);
    try {

    } catch (err) {
      console.error('Error Trading:', err);
      setError('Failed to retrieve trade. Please try again later.');
    } finally {
      setLoading(false);
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
                // ticker={ticker}
                // exchange={exchange}
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
                  handleTrade={handleTrade}
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
                    <Grid item xs={6}>
                      <FearAndGreed />
                    </Grid>
                    <Grid item xs={6}>
                      <SpyVolatility />
                    </Grid>
                  </Grid>
                </Paper>

                <MarketAI
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
                    sx={{ flex: 1 }}
                  />
                </Box>


                <Grid marginTop={2} lg={12} item xs={12} md={6}>
                  {yfInfo && fmpQuote && (
                    <TickerInfo
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
                  <AnalysisSummary loading={tickerAnalysisLoading} techAnalysisResult={techAnalysisResult1} />
                </Paper>
              </Box>
            </Grid>
            <Grid lg={1} item xs={12} md={4}>
              <Box display="flex" height="100%">
                <Paper elevation={3} sx={{ padding: 2, width: '100%', justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <AnalysisSummary loading={tickerAnalysisLoading} techAnalysisResult={techAnalysisResult2} />
                </Paper>
              </Box>
            </Grid>
            <Grid lg={3} item xs={12} md={4}>
              <Box display="flex" height="100%">
                <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
                  <ChatComponent yfInfo={yfInfo} portfolio={portfolio}/>
                </Paper>
              </Box>
            </Grid>
            <Grid item lg={5} xs={12} md={6}>
              <Box display="flex" height="100%">
                <HistoricalPricesChart
                  // historicalPrices={historicalPrices}                  
                  setHistoricalPrices={setHistoricalPrices}
                  chartData={chartData}
                  //getChartData={getChartData}                  
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
            {techAnalysisResult1 && (
              <Box flex={1}>
                <TechAnalysisResult techAnalysisResult={techAnalysisResult1} loading={tickerAnalysisLoading} />
              </Box>
            )}
          </Grid>
          <Grid item lg={4} xs={12} md={1}>
            {techAnalysisResult2 && (
              <Box flex={1}>
                <TechAnalysisResult techAnalysisResult={techAnalysisResult2} loading={tickerAnalysisLoading} />
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