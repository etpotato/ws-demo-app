import React from 'react';

import Checkbox from '../Checkbox/Checkbox';

interface Props {
  currencies: {
    symbol: string,
    name: string,
  }[],
}

export default function Controls ({currencies}: Props): JSX.Element {
  return (
    <form action="/">
      <h3 className="visually-hidden">Choose currencies to show</h3>
      <ul className="list-group list-group-horizontal flex-wrap">
        {
          currencies.map(({symbol, name}) => (
            <Checkbox id={`checkbox-${symbol}`} name={name} toggleChart={() => console.log('toggle', symbol)} key={symbol}/>
          ))
        }
      </ul>
    </form>
  );
}
