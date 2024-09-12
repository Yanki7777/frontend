import axios from "axios";

// FASTAPI
const BASE_URL = "http://localhost:8000/api/v1";

// GET request
async function get(endpoint, params = {}) {
  const res = await axios.get(BASE_URL + endpoint, {
    params,
    headers: {
      Accept: "application/json",
    },
  });
  if (res.status >= 300) {
    throw new Error(res.statusText);
  }
  return res.data;
}

// POST request
async function post(endpoint, data) {
  const res = await axios.post(BASE_URL + endpoint, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (res.status >= 300) {
    throw new Error(res.statusText);
  }
  return res.data;
}

// DELETE request
async function del(endpoint) {
  const res = await axios.delete(BASE_URL + endpoint);
  if (res.status >= 300) {
    throw new Error(res.statusText);
  }
}

// --------------------------  Tickers  --------------------------

// getTickerInfo
// YFinance
export async function getTickerInfo(ticker) {
  const endpoint = `/tickers/info/${ticker}`;
  const data = get(endpoint);
  return data;
}

// getTickerVolatility
// YFinance
export async function getTickerVolatility(ticker, period, interval) {
  const endpoint = `/tickers/volatility/${ticker}`;
  const params = {
    period,
    interval,
  };
  const data = await get(endpoint, params);
  return data;
}

// getTickerHistoricalData
// YFinance
export async function getHistoricalData(ticker, period) {
  const endpoint = `/tickers/historical-data/${ticker}`;
  const params = {
    period,
  };
  const data = await get(endpoint, params);
  return data;
}

// getNewsSentiment
// Alpha Vantage
export async function getNewsSentiment(ticker) {
  const endpoint = `/tickers/news-sentiment/${ticker}`;
  const data = get(endpoint);
  return data;
}

// getRealTimePrice
// FMP
export async function getRealTimePrice(ticker, exchange) {
  const endpoint = `/tickers/real-time-price/${ticker}`;
  const params = {
    exchange,
  };
  const data = await get(endpoint, params);
  return data;
}

// getQuote
// FMP
export async function getQuote(ticker) {
  const endpoint = `/tickers/quotes/${ticker}`;
  const data = get(endpoint);
  return data;
}

// -----------------------  Technical Analysis  -----------------------

// getTechnicalAnalysisTv
// TradingView
// OpenAI prompts
export async function getTechnicalAnalysisTv(
  ticker,
  exchange,
  screener,
  interval,
  ai
) {
  const endpoint = `/technical-analysis/tv/${ticker}`;
  const params = {
    exchange,
    screener,
    interval,
    ai,
  };
  const data = await get(endpoint, params);
  return data;
}

// getTechnicalAnalysisTa
// YFinance
// TA
export async function getTechnicalAnalysisTa(ticker, interval) {
  const endpoint = `/technical-analysis/ta/${ticker}`;
  const params = {
    interval,
  };
  const data = await get(endpoint, params);
  return {
    timestamp: data[data.length - 1].Date,
    ticker,
    interval,
    indicators: data,
  };
}

// --------------------------  Market  --------------------------

// getFearAndGreed
// FearAndGreed
export async function getFearAndGreed() {
  const endpoint = "/market/fear-and-greed";
  const data = get(endpoint);
  return data;
}

// getNasdaqStatus
// FMP
export async function getNasdaqStatus() {
  const endpoint = "/market/status/nasdaq";
  const data = get(endpoint);
  return data;
}

// --------------------------  AI  --------------------------

// getMarketAI
// OpenAI
export async function getMarketAI() {
  const endpoint = "/ai/market";
  const data = get(endpoint);
  return data;
}

export async function chat(message, context) {
  const endpoint = "/ai/chat";
  const data = await post(endpoint, { message, context });
  return data;
}

export async function resetChat() {
  const endpoint = "/ai/chat/reset";
  const data = await del(endpoint);
  return data;
}


// -------------------------  Universes -------------------------

export async function getUniverses() {
  const endpoint = "/universes";
  const data = get(endpoint);
  return data;
}


// ----------------------  Insider Trading ----------------------

// getInsiderTradingTicker
// FMP  
export async function getInsiderTradingTicker(ticker, type = "all") {
  const endpoint = `/insider-trading/ticker/${ticker}`;
  const params = {
    type,
  };
  const data = await get(endpoint, params);
  return data;
}

// getInsiderTradingUniverse
// FMP
export async function getInsiderTradingUniverse(universeId, type = "all") {
  const endpoint = `/insider-trading/universe/${universeId}`;
  const params = {
    type,
  };
  const data = await get(endpoint, params);
  return data;
}

// ------------------------  Portfolio ------------------------

export async function buildPortfolio() {}

