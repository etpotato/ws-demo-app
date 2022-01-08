import React, {useReducer, useContext, useEffect} from 'react';
import {APP, CurrencyName} from '../config';
import useWebsocket from './useWebsocket';

export interface TradesItem {
  name: string,
  labels: string[],
  data: number[],
}

interface Trades {
  active: Set<string>,
  currencies: {
    [c: string]: TradesItem,
  },
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
  const state: Trades = {
    active: new Set(prevState ? prevState.active : APP.DEFAULT_CHARTS),
    currencies: {},
  };
  for (const currency of currencies) {
    state.currencies[currency] = {
      name: CURRENCY_NAME[currency],
      labels: prevState ? [...prevState.currencies[currency].labels] : [],
      data: prevState ? [...prevState.currencies[currency].data] : [],
    };
  }
  return state;
};

const reducer: React.Reducer<Trades, Action> = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TRADES: {
      const newData = action.payload;
      if (!Array.isArray(newData)) return state;
      const newState = getState(state);
      newData.forEach((item: DataItem) => {
        const prevLabels = newState.currencies[item.symbol].labels;
        const prevData = newState.currencies[item.symbol].data;
        if (prevData[prevData.length - 1] === item.price) {
          prevLabels[prevLabels.length - 1] = new Date(item.timestamp).toLocaleTimeString('it-IT');
        } else {
          prevLabels.push(new Date(item.timestamp).toLocaleTimeString('it-IT'));
          prevData.push(item.price);
        }
      });
      for (const currency in newState.currencies) {
        const length = newState.currencies[currency].labels.length;
        if (length > APP.TRADES_LIMIT) {
          newState.currencies[currency].labels.splice(0, length - APP.TRADES_LIMIT);
          newState.currencies[currency].data.splice(0, length - APP.TRADES_LIMIT);
        }
      }
      return newState;
    }
    case ACTIONS.SET_CHARTS: {
      const newState = getState(state);
      if ('symbol' in action.payload) {
        action.payload.active
          ? newState.active.add(action.payload.symbol)
          : newState.active.delete(action.payload.symbol);
      }
      return newState;
    }
    default:
      throw new Error('from reducer');
  }
};

const defaultTrades = getState();
const defaultDispatch: React.Dispatch<Action> = () => defaultTrades;

export type setCharts = ({symbol, active}: ChartItem) => void;

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

export function TradesContextProvider ({children}: {children: JSX.Element}): JSX.Element {
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
