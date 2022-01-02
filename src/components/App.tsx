import React, { useState, useEffect } from 'react';

import TopList from './TopList/TopList';
import Chart from './Chart/Chart';
import Controls from './Controls/Controls';

interface CurrencyName {
  [c: string] : string,
}

const TRADES_LIMIT = 100;

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

const getState = (prevState?: Trades) => {
  const currencies = Object.keys(CURRENCY_NAME);
  const state: Trades = {};
  for (const currency of currencies) {
    state[currency] = {
      name: CURRENCY_NAME[currency],
      labels: prevState ? [...prevState[currency].labels] : [],
      data: prevState ? [...prevState[currency].data] : [],
    }
  }
  return state;
};

export default function App() {
  const [trades, setTrades] = useState<Trades>(getState());

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
      setTrades((state) => {
        const newState = getState(state);
        newData.forEach((item: DataItem) => {
          // if (next price === prev price) just change last date
          const prevLabels = newState[item.symbol].labels;
          const prevData = newState[item.symbol].data;
          if (prevData[prevData.length - 1] === item.price) {
            prevLabels[prevLabels.length - 1] = new Date(item.timestamp).toLocaleTimeString('it-IT');
          } else {
            prevLabels.push(new Date(item.timestamp).toLocaleTimeString('it-IT'));
            prevData.push(item.price);
          }
        });
        for (const currency in newState) {
          const length =  newState[currency].labels.length;
          if (length > TRADES_LIMIT) {
            newState[currency].labels.splice(0, length - TRADES_LIMIT);
            newState[currency].data.splice(0, length - TRADES_LIMIT);
          }
        }
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
    <>
      <header className="mb-3 py-1 box">
        <div className="container">
          <TopList currencies={Object.keys(trades).map((symbol) => ({symbol: symbol, price: trades[symbol].data[trades[symbol].data.length - 1]}))}/>
        </div>
      </header>
      <main className="container">
        <h1 className="box p-3 mb-3 rounded text-shadow-secondary">Cryptocurrency trades</h1>
          <div className="row g-3">
            <section className="col col-lg-3">
              <div className="position-sticky top-1 box rounded p-3">
                <h2 className="pb-3 text-shadow-primary">Currencies list</h2>
                  <Controls currencies={Object.keys(trades).map((symbol) => ({name: trades[symbol].name, symbol: symbol}))}/>
              </div>
            </section>
            <section className="col col-lg-9">
              <h2 className="visually-hidden">Charts</h2>
              { Object.keys(trades).map((symbol) =>
                <Chart key={symbol} name={trades[symbol].name} labels={trades[symbol].labels} data={trades[symbol].data}/>)
              }
            </section>
          </div>
      </main>
      <footer className="mb-3 box" style={{height: '20px'}}>
        <div className="container"></div>
      </footer>
    </>
  );
}
