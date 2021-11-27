import { useState } from 'react';

const words = ['this', 'is', 'my'];
const anotherWords = [...words, 'words'];

export default function Words() {
  const [count, setCount] = useState(0);
  const handleCountClick = (evt) => {
    evt.preventDefault();
    setCount((state) => state + 1);
  };

  return (
    <div>
      <p className="animate-font stagger1">{ anotherWords.join(' ') }</p>
      <button onClick={handleCountClick} type="button">Greetings!</button>
      <p className="animate-font stagger2">
        Yuo prezet di buton&ensp;
        <span style={{ color: 'royalblue' }}>{count}</span>
        timez
      </p>
    </div>
  );
}
