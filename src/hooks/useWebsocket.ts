import { useEffect } from 'react';
import { APP } from '../config';
import { DataItem } from './Context';

export default function useWebsocket (setTrades: (data: DataItem[]) => void) {
  useEffect(() => {
    const socket = new WebSocket(APP.SOCKET_URL);
    socket.onopen = () => {
      socket.send(JSON.stringify({
        op: 'subscribe',
        args: Object.keys(APP.CURRENCY_NAME).map((currency) => `trade:${currency}`),
      }));
    };

    socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      setTrades(data.data);
    };

    socket.onerror = (evt) => {
      console.log(evt);
    };

    socket.onclose = (evt) => {
      console.log(evt);
    };

    return () => socket.close();
  }, []);
}
