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

const getDefaultState = (): State => {
  const defaultState: State = {
    timestamps: [],
    currency: {},
  };
  for (const [key, value] of Object.entries(CURRENCY_NAME)) {
    defaultState.currency[key] = {
      name: value,
      data: [
        {
          price: 0,
          timestamp: '',
        },
      ],
    };
  }
  return defaultState;
};

const tradesItem: tradesItem = {
  XBTUSD: {
    name: 'Bitcoin',
    prices: []
  },
  ETHUSD: {
    name: 'Etherium',
    prices: []
  },
  XRPUSD: {
    name: 'Ripple',
    prices: []
  },
};

export interface tradesItem {
  [c: string]: {
    name: string,
    prices: number[],
  },
}

interface accumItem {
  [c: string]: {
    [t:string]: number,
  }
}

interface DataItem {
  symbol: string,
  price: number,
  timestamp: string,
}

interface ChartDot {
  price: number,
  timestamp: string,
}

interface Currency {
  [c: string]: {
    name: string,
    data: Array<ChartDot>,
  }
}

interface State {
  timestamps: string[],
  currency: {
    [c: string]: {
      name: string,
      data: Array<{
        price: number,
        timestamp: string,
      }>
    }
  }
}

export default function App() {
  const [trades, setTrades] = useState({
    timestamps: [''],
    currencies: {...tradesItem},
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
      setTrades((state) => {
        const filtered: accumItem = {
          XBTUSD: {},
          ETHUSD: {},
          XRPUSD: {},
        };
        newData.forEach((item: DataItem) => {
          filtered[item.symbol][item.timestamp] = item.price;
        }, );


        // using Set to filter unique timestamps
        const timestampSet: Set<string> = new Set();
        Object.keys(filtered).forEach((key) => {
          Object.keys(filtered[key]).forEach((innerKey) => timestampSet.add(innerKey));
        });
        const newTimestaps: string[] = Array.from(timestampSet).sort();

        // make mirrored arrays of prices
        const newPrices = {...tradesItem};
        Object.keys(newPrices).forEach((key) => {
          newTimestaps.forEach((timestamp, index) => {
            let price = filtered[key][timestamp];
            if (!price) {
              price = newPrices[key].prices[index - 1];
            }
            if (!price) {
              price = state.currencies[key].prices[state.currencies[key].prices.length - 1];
            }
            if (!price) price = 0;
            newPrices[key].prices.push(price);
          });
        });

        return {
          timestamps: [...state.timestamps, ...newTimestaps],
          currencies: {
            XBTUSD: {
              name: 'Bitcoin',
              prices: [...state.currencies.XBTUSD.prices, ...newPrices.XBTUSD.prices],
            },
            ETHUSD: {
              name: 'Etherium',
              prices: [...state.currencies.ETHUSD.prices, ...newPrices.ETHUSD.prices],
            },
            XRPUSD: {
              name: 'Ripple',
              prices: [...state.currencies.XRPUSD.prices, ...newPrices.XRPUSD.prices],
            },
          },
        };
      });
      // new Date(newData.timestamp).toLocaleTimeString()
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
      <Chart trades={trades}/>
    </>
  );
}
