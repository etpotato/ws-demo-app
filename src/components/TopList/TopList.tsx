import React from 'react';
import { useTradesContext } from '../../hooks/Context';
import TopItem from '../TopItem/TopItem';

export default function TopList (): JSX.Element {
  const {trades} = useTradesContext();

  return (
    <dl className="list-group list-group-horizontal px-3 overflow-auto hide-crollbar">
      {Object.keys(trades.currencies).map((symbol) => (
        <TopItem
          symbol={symbol}
          price={trades.currencies[symbol].data[trades.currencies[symbol].data.length - 1]}
          key={symbol}
        />
      ))}
      {Object.keys(trades.currencies).map((symbol) => (
        <TopItem
          symbol={symbol}
          price={trades.currencies[symbol].data[trades.currencies[symbol].data.length - 1]}
          key={symbol}
        />
      ))}
    </dl>
  );
}
