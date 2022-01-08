import React, {useEffect, useMemo} from 'react';
import { useTradesContext } from '../../hooks/Context';

import Checkbox from '../Checkbox/Checkbox';

export default function Controls (): JSX.Element {
  const {trades, dispatch: {setCharts}} = useTradesContext();

  // useEffect(() => console.log('controls'));

  return useMemo(() => {
    console.log('controls')
    return (
      <form action="/">
        <h3 className="visually-hidden">Choose currencies to show</h3>
        <ul className="list-group list-group-horizontal flex-wrap">
          {
            Object.keys(trades.currencies).map((symbol) => (
              <Checkbox
                symbol={symbol}
                name={trades.currencies[symbol].name}
                key={symbol}
                checked={trades.active.has(symbol)}
                setCharts={setCharts}
              />
            ))
          }
        </ul>
      </form>
    );
  }, [trades.active.size]);
}
