import React, {useReducer, useContext, useEffect} from 'react';
import {APP, CurrencyName} from '../config';
import useWebsocket from './useWebsocket';

interface Trades {
  [c: string]: {
    name: string,
    active: boolean,
    labels: string[],
    data: number[],
  },
}

export interface TradesItem {
  name: string,
  labels: string[],
  data: number[],
}

export interface DataItem {
  symbol: string,
  price: number,
  timestamp: string,
}

interface ChartItem {
  symbol: string,
  active: boolean,
}

type Action =
  | {type: string, payload: DataItem[]}
  | {type: string, payload: ChartItem};

const CURRENCY_NAME: CurrencyName = APP.CURRENCY_NAME;
const ACTIONS = APP.ACTIONS;

const getState = (prevState?: Trades) => {
  const currencies = Object.keys(CURRENCY_NAME);
  const state: Trades = {};
  for (const currency of currencies) {
    state[currency] = {
      name: CURRENCY_NAME[currency],
      active: prevState ? prevState[currency].active : currency in APP.DEFAULT_CHARTS,
      labels: prevState ? [...prevState[currency].labels] : [],
      data: prevState ? [...prevState[currency].data] : [],
    };
  }
  return state;
};

const reducer: React.Reducer<Trades, Action> = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TRADES: {
      const newData = action.payload;
      const newState = getState(state);
      Array.isArray(newData) && newData.forEach((item: DataItem) => {
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
        if (length > APP.TRADES_LIMIT) {
          newState[currency].labels.splice(0, length - APP.TRADES_LIMIT);
          newState[currency].data.splice(0, length - APP.TRADES_LIMIT);
        }
      }
      return newState;
    }
    case ACTIONS.SET_CHARTS: {
      const newState = getState(state);
      if ('symbol' in action.payload) {
        newState[action.payload.symbol].active = action.payload.active;
      }
      return newState;
    }
    default:
      throw new Error('from reducer');
  }
};

const defaultTrades = getState();
const defaultDispatch: React.Dispatch<Action> = () => defaultTrades;

const setTrades = (dispatch: React.Dispatch<Action>) =>
  (data: DataItem[]) =>
    dispatch({type: APP.ACTIONS.SET_TRADES, payload: data});
const setCharts = (dispatch: React.Dispatch<Action>) =>
  ({symbol, active}: ChartItem) =>
    dispatch({type: APP.ACTIONS.SET_CHARTS, payload: {symbol, active}});

const TradesContext = React.createContext({
  trades: defaultTrades,
  dispatch: {
    setTrades: setTrades(defaultDispatch),
    setCharts: setCharts(defaultDispatch),
  },
});


export function TradesContextProvider ({children}: {children: JSX.Element[]}): JSX.Element {
  const [trades, dispatch] = useReducer(reducer, getState());

  const value = {
    trades,
    dispatch: {
      setTrades: setTrades(dispatch),
      setCharts: setCharts(dispatch),
    }
  };

  useWebsocket(setTrades(dispatch));

  return (
    <TradesContext.Provider value={value}>
      {children}
    </TradesContext.Provider>
  );
}

export const useTradesContext = () => useContext(TradesContext);
