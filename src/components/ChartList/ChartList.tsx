import React from 'react';
import { useTradesContext } from '../../hooks/Context';
import Chart from '../Chart/Chart';

export default function ChartList (): JSX.Element {
  const {trades} = useTradesContext();
  return (
    <ul>
      { Object.keys(trades).map((symbol) => {
          if (trades[symbol].active) {
            return <Chart key={symbol} name={trades[symbol].name} labels={trades[symbol].labels} data={trades[symbol].data}/>
          }
        })
      }
    </ul>
  );
}
