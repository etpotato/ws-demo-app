import React from 'react';
import { setCharts } from '../../hooks/Context';

interface Props {
  symbol: string,
  name: string,
  checked: boolean,
  setCharts: setCharts,
}

export default function Checkbox ({symbol, name, checked, setCharts}: Props): JSX.Element {
  const handleChange = () => setCharts({symbol, active: !checked});

  return (
    <li className="list-group-item me-2 mb-2">
      <input
        className="btn-check"
        id={`checkbox-${symbol}`}
        onChange={handleChange}
        checked={checked}
        type="checkbox"
      />
      <label className="btn btn-outline-primary" htmlFor={`checkbox-${symbol}`}>{name}</label>
    </li>
  );
}
