import {
  WS_CONN_START,
  WS_CONN_OK,
  WS_CONN_STOP,
  WS_CONN_END,
  WS_CONN_ERR,
  WS_SEND_MSG,
  WS_RECV_MSG
} from '../actions/wsActions';

let ws = null;

export const wsMiddleware = store => next => action => {
  const {dispatch} = store;

  switch(action.type) {
    case WS_CONN_START:
      ws = new WebSocket(action.url);

      /* setting up callbacks */

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
      dispatch({
        type: WS_SEND_MSG,
        payload: {
          type: 'register',
          uuid: store.getState().connection.uuid
        }
      })
      break;
    case WS_SEND_MSG:
      let strPayload = JSON.stringify(action.payload);
      console.log('sending:', strPayload);
      ws.send(strPayload);
      break;
    default:
      next(action);
  }
}
