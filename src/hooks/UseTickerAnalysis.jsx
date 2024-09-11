import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/config';

const UseTickerAnalysis = (ticker, exchange, screener, tickerInterval) => {
  const [tickerInfo, setTickerInfo] = useState(null);
  const [realTimePrice, setRealTimePrice] = useState(null);
  const [insiderTrading, setInsiderTrading] = useState(null);
  const [techAnalysisResult, setTechAnalysisResult] = useState(null);
  const [historicalPrices, setHistoricalPrices] = useState(null);
  const [newsSentiment, setNewsSentiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [tickerInfoRes, realTimePriceRes, insiderTradingRes, techAnalysisRes, historicalRes, newsSentimentRes] = await Promise.all([
          axios.post(`${baseUrl}/ticker_info`, { ticker }),
          axios.post(`${baseUrl}/realtime-ticker-price`, { ticker }),
          axios.post(`${baseUrl}/ticker-insider-trading`, { ticker }),
          axios.post(`${baseUrl}/tech_analyze_ticker`, { ticker, exchange, screener, tickerInterval }),
          axios.post(`${baseUrl}/historical_data`, { ticker, days: 3650 }),
          axios.post(`${baseUrl}/news_sentiment`, { ticker }),
        ]);

        setTickerInfo(tickerInfoRes.data.ticker_info);
        setRealTimePrice(realTimePriceRes.data.stock_price);
        setInsiderTrading(insiderTradingRes.data.insider_trading);
        setTechAnalysisResult(techAnalysisRes.data);
        setHistoricalPrices(historicalRes.data.historical_data);
        setNewsSentiment(newsSentimentRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Server error, please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker, exchange, screener, tickerInterval]);

  return {
    tickerInfo,
    realTimePrice,
    insiderTrading,
    techAnalysisResult,
    historicalPrices,
    newsSentiment,
    loading,
    error,
  };
};

export default UseTickerAnalysis;
