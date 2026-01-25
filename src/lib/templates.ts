import type { DashboardTemplate } from '@/types';

// Pre-built dashboard templates for quick start
export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: 'crypto-tracker',
    name: 'Crypto Tracker',
    description: 'Track major cryptocurrencies with real-time exchange rates from Coinbase',
    config: {
      name: 'Crypto Tracker Dashboard',
      widgets: [
        {
          id: 'btc-widget',
          name: 'Bitcoin (BTC)',
          type: 'card',
          apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
          refreshInterval: 30,
          fields: [
            { path: 'data.currency', label: 'Currency', format: 'text' },
            { path: 'data.rates.USD', label: 'USD', format: 'number' },
            { path: 'data.rates.EUR', label: 'EUR', format: 'number' },
            { path: 'data.rates.INR', label: 'INR', format: 'number' },
          ],
        },
        {
          id: 'eth-widget',
          name: 'Ethereum (ETH)',
          type: 'card',
          apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
          refreshInterval: 30,
          fields: [
            { path: 'data.currency', label: 'Currency', format: 'text' },
            { path: 'data.rates.USD', label: 'USD', format: 'number' },
            { path: 'data.rates.EUR', label: 'EUR', format: 'number' },
            { path: 'data.rates.INR', label: 'INR', format: 'number' },
          ],
        },
        {
          id: 'sol-widget',
          name: 'Solana (SOL)',
          type: 'card',
          apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=SOL',
          refreshInterval: 30,
          fields: [
            { path: 'data.currency', label: 'Currency', format: 'text' },
            { path: 'data.rates.USD', label: 'USD', format: 'number' },
            { path: 'data.rates.INR', label: 'INR', format: 'number' },
          ],
        },
      ],
      layout: [
        { i: 'btc-widget', x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
        { i: 'eth-widget', x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
        { i: 'sol-widget', x: 8, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
      ],
    },
  },
  {
    id: 'multi-currency',
    name: 'Currency Exchange',
    description: 'Monitor exchange rates across multiple currencies',
    config: {
      name: 'Currency Exchange Dashboard',
      widgets: [
        {
          id: 'usd-rates',
          name: 'USD Exchange Rates',
          type: 'card',
          apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=USD',
          refreshInterval: 60,
          fields: [
            { path: 'data.currency', label: 'Base', format: 'text' },
            { path: 'data.rates.EUR', label: 'EUR', format: 'number' },
            { path: 'data.rates.GBP', label: 'GBP', format: 'number' },
            { path: 'data.rates.JPY', label: 'JPY', format: 'number' },
            { path: 'data.rates.INR', label: 'INR', format: 'number' },
          ],
        },
        {
          id: 'eur-rates',
          name: 'EUR Exchange Rates',
          type: 'card',
          apiUrl: 'https://api.coinbase.com/v2/exchange-rates?currency=EUR',
          refreshInterval: 60,
          fields: [
            { path: 'data.currency', label: 'Base', format: 'text' },
            { path: 'data.rates.USD', label: 'USD', format: 'number' },
            { path: 'data.rates.GBP', label: 'GBP', format: 'number' },
            { path: 'data.rates.INR', label: 'INR', format: 'number' },
          ],
        },
      ],
      layout: [
        { i: 'usd-rates', x: 0, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
        { i: 'eur-rates', x: 6, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
      ],
    },
  },
  {
    id: 'empty',
    name: 'Start Fresh',
    description: 'Begin with an empty dashboard and add your own custom widgets',
    config: {
      name: 'My Finance Dashboard',
      widgets: [],
      layout: [],
    },
  },
];

// Sample API endpoints that users can try (free, no API key required)
export const sampleApis = [
  {
    name: 'Bitcoin Exchange Rates',
    url: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
    description: 'Get Bitcoin exchange rates in multiple currencies (Free)',
  },
  {
    name: 'Ethereum Exchange Rates',
    url: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH',
    description: 'Get Ethereum exchange rates in multiple currencies (Free)',
  },
  {
    name: 'USD Exchange Rates',
    url: 'https://api.coinbase.com/v2/exchange-rates?currency=USD',
    description: 'Get USD exchange rates against other currencies (Free)',
  },
  {
    name: 'CoinGecko Bitcoin',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,inr&include_24hr_change=true',
    description: 'Bitcoin price with 24h change from CoinGecko (Free)',
  },
  {
    name: 'CoinGecko Top Coins',
    url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1',
    description: 'Top 10 cryptocurrencies by market cap (Free)',
  },
  {
    name: 'Exchange Rates API',
    url: 'https://open.er-api.com/v6/latest/USD',
    description: 'Latest USD exchange rates (Free)',
  },
];

// API providers that require API keys
export const apiProvidersInfo = [
  {
    name: 'Alpha Vantage',
    description: 'Stocks, Forex, Crypto, Fundamentals',
    baseUrl: 'https://www.alphavantage.co/query',
    keyParam: 'apikey',
    exampleEndpoints: [
      { name: 'Stock Quote', endpoint: '?function=GLOBAL_QUOTE&symbol=IBM' },
      { name: 'Time Series Daily', endpoint: '?function=TIME_SERIES_DAILY&symbol=IBM' },
      { name: 'Forex Rate', endpoint: '?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR' },
      { name: 'Top Gainers/Losers', endpoint: '?function=TOP_GAINERS_LOSERS' },
      { name: 'Company Overview', endpoint: '?function=OVERVIEW&symbol=IBM' },
    ],
    signupUrl: 'https://www.alphavantage.co/support/#api-key',
    rateLimit: '25 requests/day (Free)',
    documentation: 'https://www.alphavantage.co/documentation/',
  },
  {
    name: 'Finnhub',
    description: 'Real-time stocks, news, fundamentals',
    baseUrl: 'https://finnhub.io/api/v1',
    keyParam: 'token',
    exampleEndpoints: [
      { name: 'Stock Quote', endpoint: '/quote?symbol=AAPL' },
      { name: 'Company Profile', endpoint: '/stock/profile2?symbol=AAPL' },
      { name: 'Market News', endpoint: '/news?category=general' },
      { name: 'Company News', endpoint: '/company-news?symbol=AAPL&from=2024-01-01&to=2024-12-31' },
      { name: 'Recommendations', endpoint: '/stock/recommendation?symbol=AAPL' },
    ],
    signupUrl: 'https://finnhub.io/register',
    rateLimit: '60 requests/min (Free)',
    documentation: 'https://finnhub.io/docs/api',
  },
  {
    name: 'Twelve Data',
    description: 'Stocks, Forex, Crypto, ETFs',
    baseUrl: 'https://api.twelvedata.com',
    keyParam: 'apikey',
    exampleEndpoints: [
      { name: 'Stock Price', endpoint: '/price?symbol=AAPL' },
      { name: 'Stock Quote', endpoint: '/quote?symbol=AAPL' },
      { name: 'Time Series', endpoint: '/time_series?symbol=AAPL&interval=1day&outputsize=30' },
      { name: 'Exchange Rate', endpoint: '/exchange_rate?symbol=USD/EUR' },
    ],
    signupUrl: 'https://twelvedata.com/account',
    rateLimit: '8 requests/min (Free)',
    documentation: 'https://twelvedata.com/docs',
  },
];
