import React, { useState, useEffect } from 'react';
import Chart from './Chart/Chart';

import '../styles/index.scss';

type Currency = { [c: string]: string };

type DataItem = {
  symbol: string,
  price: number,
};

const CURRENCY: Currency = {
  XBTUSD: 'Bitcoin',
  ADAUSD: 'Cardano',
  AVAXUSD: 'Avalanche',
  AXSUSD: 'Axie Infinity',
  ALTMEXUSD: 'Baskets',
  BCHUSD: 'Bitcoin Cash',
  BNBUSD: 'Binance Coin',
  DOGEUSD: 'Dogecoin',
  DOTUSD: 'Polkadot',
  EOSUSD: 'EOS Token',
  ETHUSD: 'Etherium',
  LINKUSD: 'Chainlink',
  LTCUSD: 'Litecoin',
  LUNAUSD: 'Terra',
  SOLUSD: 'Solana',
};

const chartData = {
  labels: ['label1', 'label2', 'label3', 'label4'],
  datasets: [
    {
      label: 'data1',
      data: [1, 2, 3, 4, 5, 6, 7],
    },
  ],
}

export default function App() {
  const [trades, setTrades] = useState(CURRENCY);

  useEffect(() => {
    const SOCKET_URL = 'wss://ws.bitmex.com/realtime';
    const socket = new WebSocket(SOCKET_URL);
    socket.onopen = () => {
      socket.send(JSON.stringify({
        op: 'subscribe',
        args: Object.keys(CURRENCY).map((item) => `trade:${item}`),
      }));
    };

    socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data).data?.reduce((accum: Currency, item: DataItem) => {
        accum[item.symbol] = item.price.toFixed(2);
        return accum;
      }, {});
      setTrades((state) => ({ ...state, ...data }));
    };

    socket.onerror = (evt) => {
      console.log(evt);
    };

    socket.onclose = (evt) => {
      console.log(evt);
    };

    return () => socket.close();
  }, []);

  useEffect(() => console.log(trades), [trades]);

  return (
    <>
      <h1 className="animate-font">Hello from react</h1>
      <ul>
        {Object.keys(CURRENCY).map((key: string) => (
          <li key={key}>{CURRENCY[key]}:
            <span>{trades[key]}$</span>
          </li>
        ))}
      </ul>
      <Chart chartData={chartData}/>
    </>
  );
}
