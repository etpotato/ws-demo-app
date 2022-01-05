import React from 'react';
import { useTradesContext } from '../../hooks/Context';

export default function TopList (): JSX.Element {
  const {trades} = useTradesContext();
  const currencies = Object.keys(trades).map((symbol) =>
    ({
      symbol: symbol,
      price: trades[symbol].data[trades[symbol].data.length - 1]
    })
  );

  return (
    <dl className="list-group list-group-horizontal px-3 overflow-auto hide-crollbar">
      {currencies.map((item) => (
        <div className="d-flex me-3" key={item.symbol}>
          <dt className="me-1 text-shadow-primary">{item.symbol}: </dt>
          <dd className="mb-0 text-shadow-secondary">{item.price}</dd>
        </div>
      ))}
    </dl>
  );
}
