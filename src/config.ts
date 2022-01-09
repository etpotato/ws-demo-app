export const APP = {
  TRADES_LIMIT: 80,
  SOCKET_URL: 'wss://ws.bitmex.com/realtime',
  SOCKET_TIMEOUT: 5000,
  CURRENCY_NAME: {
    AVAXUSD: 'Avalanche',
    AXSUSD: 'Axie Infinity',
    BNBUSD: 'Binance Coin',
    XBTUSD: 'Bitcoin',
    BCHUSD: 'Bitcoin Cash',
    ADAUSD: 'Cardano',
    LINKUSD: 'Chainlink',
    DOGEUSD: 'Dogecoin',
    EOSUSD: 'EOS Token',
    ETHUSD: 'Etherium',
    LTCUSD: 'Litecoin',
    DOTUSD: 'Polkadot',
    XRPUSD: 'Ripple',
    SOLUSD: 'Solana',
  },
  DEFAULT_CHARTS: ['XBTUSD', 'ETHUSD', 'XRPUSD'],
  ACTIONS: {
    SET_TRADES: 'SET_TRADES',
    SET_CHARTS: 'SET_CHARTS',
  },
};

export interface CurrencyName {
  [c: string] : string,
}
