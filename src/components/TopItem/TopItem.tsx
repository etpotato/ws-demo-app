import React from 'react';

interface Props {
  symbol: string,
  price: number
}

function TopItem ({symbol, price}: Props) {
  return (
    <div className="top-item d-flex me-3" key={symbol}>
      <dt className="me-1 text-shadow-primary">{symbol}: </dt>
      <dd className="mb-0 text-shadow-secondary">{price}</dd>
    </div>
  );
}

export default React.memo(TopItem, (prevProps, nextProps) => prevProps.price === nextProps.price)
