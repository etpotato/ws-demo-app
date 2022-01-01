import React, {useState, useEffect} from 'react';

interface Props {
  id: string,
  name: string,
  toggleChart: any,
  checked?: boolean,
}

export default function Checkbox ({id, name, toggleChart, checked = false}: Props): JSX.Element {
  const [isChecked, setIsChecked] = useState(false);
  const handleChange = () => setIsChecked((state) => !state);
  useEffect(() => {
    checked && setIsChecked(checked);
  }, []);
  useEffect(() => toggleChart, [isChecked]);

  return (
    <li className="list-group-item me-2 mb-2">
      <input
        className="btn-check"
        id={id}
        onChange={handleChange}
        checked={isChecked}
        type="checkbox"
      />
      <label className="btn btn-outline-info" htmlFor={id}>{name}</label>
    </li>
  );
}
