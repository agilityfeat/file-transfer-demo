import {
  WS_CONN_START,
  WS_CONN_OK,
  WS_CONN_STOP,
  WS_CONN_END,
  WS_CONN_ERR,
  WS_SEND_MSG,
  wsSendMessage,
  WS_RECV_MSG
} from '../actions/wsActions';

import {
  iceReceive,
  offerReceive
} from '../actions/webrtcActions';

let ws = null;

export const wsMiddleware = store => next => action => {
  const {dispatch} = store;

  switch(action.type) {
    case WS_CONN_START:
      ws = new WebSocket(action.url);

      ws.onopen = () => dispatch({type: WS_CONN_OK});
      ws.onclose = () => dispatch({type: WS_CONN_END});
      ws.onmessage = (payload) => dispatch({type: WS_RECV_MSG, payload});

      next(action);
      break;
    case WS_CONN_STOP:
      ws.close();
      break;
    case WS_CONN_OK:
      next(action);
      dispatch(wsSendMessage({
        type: 'register',
        uuid: store.getState().connection.uuid
      }));
      break;
    case WS_SEND_MSG:
      let strPayload = JSON.stringify(action.payload);
      ws.send(strPayload);
      break;
    case WS_RECV_MSG:
      let {data} = action.payload;
      data = JSON.parse(data);

      data.candidate && dispatch(iceReceive(data.candidate));
      data.type && data.type === 'offer' && dispatch(offerReceive(data));

      next(action);
      break;
    default:
      next(action);
  }
}
