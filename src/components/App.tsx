import React, { useState, useEffect } from 'react';
import Chart from './Chart/Chart';

import '../styles/index.scss';

interface CurrencyName {
  [c: string] : string,
}

const SOCKET_URL = 'wss://ws.bitmex.com/realtime';

const CURRENCY_NAME: CurrencyName = {
  XBTUSD: 'Bitcoin',
  ETHUSD: 'Etherium',
  XRPUSD: 'Ripple',
};

interface Trades {
  [c: string]: {
    name: string,
    labels: string[],
    data: number[],
  },
}

export interface TradesItem {
  name: string,
  labels: string[],
  data: number[],
}

interface DataItem {
  symbol: string,
  price: number,
  timestamp: string,
}

export default function App() {
  const [trades, setTrades] = useState<Trades>({
    XBTUSD: {
      name: CURRENCY_NAME.XBTUSD,
      labels: [],
      data: [],
    },
    ETHUSD: {
      name: CURRENCY_NAME.ETHUSD,
      labels: [],
      data: [],
    },
    XRPUSD: {
      name: CURRENCY_NAME.XRPUSD,
      labels: [],
      data: [],
    },
  });

  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);
    socket.onopen = () => {
      socket.send(JSON.stringify({
        op: 'subscribe',
        args: Object.keys(CURRENCY_NAME).map((currency) => `trade:${currency}`),
      }));
    };

    socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (!data?.data?.length) return;
      // newData - array of objects
      const newData = data.data;
      setTrades((state: Trades) => {
        const newState = {...state};
        newData.forEach((item: DataItem) => {
          newState[item.symbol].labels.push(new Date(item.timestamp).toLocaleTimeString());
          newState[item.symbol].data.push(item.price);
        });
        return newState;
      });
    };

    socket.onerror = (evt) => {
      console.log(evt);
    };

    socket.onclose = (evt) => {
      console.log(evt);
    };

    return () => socket.close();
  }, []);

  return (
    <div className="container">
      <h1 className="animate-font">Hello from react</h1>
      { Object.keys(CURRENCY_NAME).map((currency) =>
        <Chart key={currency} tradesItem={trades[currency]}/>)
      }
    </div>
  );
}
