import React from 'react';

interface Props {
  symbol: string,
  price: number
}

function TopItem ({symbol, price}: Props) {
  return (
    <div className="d-flex me-3" key={symbol}>
      <dt className="me-1 text-shadow-primary fw-normal">{symbol}: </dt>
      <dd className="top-item-number mb-0 text-shadow-secondary">{price}</dd>
    </div>
  );
}

export default React.memo(TopItem, (prevProps, nextProps) => prevProps.price === nextProps.price)
