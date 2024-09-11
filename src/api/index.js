import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

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

async function del(endpoint) {
  const res = await axios.delete(BASE_URL + endpoint);
  if (res.status >= 300) {
    throw new Error(res.statusText);
  }
}

export async function getTickerInfo(ticker) {
  const endpoint = `/tickers/info/${ticker}`;
  const data = get(endpoint);
  return data;
}

export async function getTickerVolatility(ticker, period, interval) {
  const endpoint = `/tickers/volatility/${ticker}`;
  const params = {
    period,
    interval,
  };
  const data = await get(endpoint, params);
  return data;
}

export async function getHistoricalData(ticker, period) {
  const endpoint = `/tickers/historical-data/${ticker}`;
  const params = {
    period,
  };
  const data = await get(endpoint, params);
  return data;
}

export async function getNewsSentiment(ticker) {
  const endpoint = `/tickers/news-sentiment/${ticker}`;
  const data = get(endpoint);
  return data;
}

export async function getRealTimePrice(ticker, exchange) {
  const endpoint = `/tickers/real-time-price/${ticker}`;
  const params = {
    exchange,
  };
  const data = await get(endpoint, params);
  return data;
}

export async function getQuote(ticker) {
  const endpoint = `/tickers/quotes/${ticker}`;
  const data = get(endpoint);
  return data;
}

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

export async function getFearAndGreed() {
  const endpoint = "/market/fear-and-greed";
  const data = get(endpoint);
  return data;
}

export async function getNasdaqStatus() {
  const endpoint = "/market/status/nasdaq";
  const data = get(endpoint);
  return data;
}

export async function getMarketAI() {
  const endpoint = "/ai/market";
  const data = get(endpoint);
  return data;
}

export async function getUniverses() {
  const endpoint = "/universes";
  const data = get(endpoint);
  return data;
}

export async function getInsiderTradingTicker(ticker, type = "all") {
  const endpoint = `/insider-trading/ticker/${ticker}`;
  const params = {
    type,
  };
  const data = await get(endpoint, params);
  return data;
}

export async function getInsiderTradingUniverse(universeId, type = "all") {
  const endpoint = `/insider-trading/universe/${universeId}`;
  const params = {
    type,
  };
  const data = await get(endpoint, params);
  return data;
}

export async function buildPortfolio() {}

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
