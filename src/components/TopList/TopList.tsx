import React from 'react';

interface Props {
  currencies: {
    symbol: string,
    price: number,
  }[],
}

export default function TopList ({currencies}: Props): JSX.Element {
  return(
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
