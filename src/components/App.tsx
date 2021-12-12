import React, { useState, useEffect } from 'react';
import Chart from './Chart/Chart';

import { round } from '../helpers';

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
  const [trades, setTrades] = useState({
    XBTUSD: {
      name: 'Bitcoin',
      labels: [''],
      data: [0],
    },
    ETHUSD: {
      name: 'Ehterium',
      labels: [''],
      data: [0],
    },
    XRPUSD: {
      name: 'Ripple',
      labels: [''],
      data: [0],
    },
  });

  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);
    socket.onopen = () => {
      socket.send(JSON.stringify({
        op: 'subscribe',
        // args: 'trade:XBTUSD',
        args: ['trade:XBTUSD', 'trade:ETHUSD', 'trade:XRPUSD'],
        // args: Object.keys(CURRENCY_NAME).map((item) => `trade:${item}`),
        // args: Object.keys(CURRENCY).map((item) => `orderBookL2_25:${item}`),
      }));
    };

    socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (!data?.data?.length) return;
      // newData - array of objects
      const newData = data.data;
      setTrades((state: any) => {
        newData.forEach((item: DataItem) => {
          state[item.symbol].labels.push(new Date(item.timestamp).toLocaleTimeString());
          state[item.symbol].data.push(item.price);
        });
        return state;
      });
      console.log('message');
    };

    socket.onerror = (evt) => {
      console.log(evt);
    };

    socket.onclose = (evt) => {
      console.log(evt);
    };

    return () => socket.close();
  }, []);

  // useEffect(() => console.log(trades), [trades]);

  return (
    <>
      <h1 className="animate-font">Hello from react</h1>
      <Chart key="XBTUSD" tradesItem={trades.XBTUSD}/>
      <Chart key="ETHUSD" tradesItem={trades.ETHUSD}/>
      <Chart key="XRPUSD" tradesItem={trades.XRPUSD}/>
    </>
  );
}
