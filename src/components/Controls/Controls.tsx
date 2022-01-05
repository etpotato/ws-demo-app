import React from 'react';
import { useTradesContext } from '../../hooks/Context';

import Checkbox from '../Checkbox/Checkbox';

export default function Controls (): JSX.Element {
  const {trades} = useTradesContext();
  const currencies = Object.keys(trades).map((symbol) =>
    ({
      name: trades[symbol].name,
      symbol: symbol
    })
  );

  return (
    <form action="/">
      <h3 className="visually-hidden">Choose currencies to show</h3>
      <ul className="list-group list-group-horizontal flex-wrap">
        {
          currencies.map(({name, symbol}) => (
            <Checkbox symbol={symbol} name={name} key={symbol}/>
          ))
        }
      </ul>
    </form>
  );
}
