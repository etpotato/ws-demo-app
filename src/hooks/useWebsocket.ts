import { useState, useEffect } from 'react';
import { APP } from '../config';
import { DataItem } from './Context';

let isReconnect = false;
let pingTimeout: ReturnType<typeof setTimeout>;

export default function useWebsocket (setTrades: (data: DataItem[]) => void) {
  const [isWsAlive, setIsWsAlive] = useState(false);

  function onWsClose () {
    clearTimeout(pingTimeout);
    setIsWsAlive(false);
    if (!isReconnect) {
      setTimeout(initWebsocket, APP.SOCKET_TIMEOUT);
      isReconnect = true;
    }
  }

  function initWebsocket () {
    const socket = new WebSocket(APP.SOCKET_URL);
    const ping = () => socket.send('ping');

    isReconnect = false;

    socket.onopen = () => {
      pingTimeout = setTimeout(ping, APP.SOCKET_TIMEOUT);
      setIsWsAlive(true);
      socket.send(JSON.stringify({
        op: 'subscribe',
        args: Object.keys(APP.CURRENCY_NAME).map((currency) => `trade:${currency}`),
      }));
    };

    socket.onmessage = (evt) => {
      clearTimeout(pingTimeout);
      pingTimeout = setTimeout(ping, APP.SOCKET_TIMEOUT);
      try {
        const data = JSON.parse(evt.data);
        setTrades(data.data);
      } catch (err) {
        if (evt.data !== 'pong') {
          console.error(err);
          socket.close();
        }
      }
    };

    socket.onerror = (evt) => {
      console.error(evt);
      onWsClose();
    };

    socket.onclose = () => {
      onWsClose();
    };

    return () => socket.close();
  }

  useEffect(initWebsocket, []);

  return isWsAlive;
}
