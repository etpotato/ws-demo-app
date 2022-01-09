import React, {useMemo} from 'react';
import {useTradesContext} from '../../hooks/Context';

export default function WsLight (): JSX.Element {
  const {isWsAlive} = useTradesContext();
  return useMemo(() => (
    <p className="box position-fixed bottom-0 end-0 small p-2 mb-0">
      {isWsAlive ? '' : <span className="d-block mb-3 text-warning fw-normal">Please, wait for reconnection <br/>or reaload the page</span>}
      <span className="ws-light me-2" style={{backgroundColor: isWsAlive ? '#199d00' : '#83012f'}}></span>
      <span>WebSocket connection</span>
      <span className="visually-hidden">{isWsAlive ? 'online' : 'offline'}</span>
    </p>
  ), [isWsAlive]);
}
