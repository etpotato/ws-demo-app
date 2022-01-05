import React, {useState, useEffect} from 'react';
import { useTradesContext } from '../../hooks/Context';

interface Props {
  symbol: string,
  name: string,
  checked?: boolean,
}

export default function Checkbox ({symbol, name, checked = false}: Props): JSX.Element {
  const [isChecked, setIsChecked] = useState(false);
  const {dispatch: {setCharts}} = useTradesContext();

  const handleChange = () => setIsChecked((state) => !state);

  useEffect(() => {
    checked && setIsChecked(checked);
  }, []);

  useEffect(() => setCharts({symbol, active: isChecked}), [isChecked]);

  return (
    <li className="list-group-item me-2 mb-2">
      <input
        className="btn-check"
        id={`checkbox-${symbol}`}
        onChange={handleChange}
        checked={isChecked}
        type="checkbox"
      />
      <label className="btn btn-outline-primary" htmlFor={`checkbox-${symbol}`}>{name}</label>
    </li>
  );
}
