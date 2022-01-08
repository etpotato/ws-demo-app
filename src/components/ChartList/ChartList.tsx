import React from 'react';
import { useTradesContext } from '../../hooks/Context';
import Chart from '../Chart/Chart';

export default function ChartList (): JSX.Element {
  const {trades} = useTradesContext();

  return (
    <ul className="list-reset">
      { Object.keys(trades.currencies).map((symbol) => {
          if (trades.active.has(symbol)) {
            const currency = trades.currencies[symbol];
            return <Chart
                      key={symbol}
                      name={currency.name}
                      labels={currency.labels}
                      data={currency.data}
                    />
          }
        })
      }
    </ul>
  );
}
