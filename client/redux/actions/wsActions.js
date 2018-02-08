export const WS_CONN_START = 'WS_CONN_START';
export const WS_CONN_OK    = 'WS_CONN_OK';
export const WS_CONN_ERR   = 'WS_CONN_ERR';
export const WS_CONN_STOP  = 'WS_CONN_STOP';
export const WS_CONN_END   = 'WS_CONN_END';
export const WS_SEND_MSG   = 'WS_SEND_MSG';
export const WS_RECV_MSG   = 'WS_RECV_MSG';

export function wsConnectionStart(url) {
  return {type: WS_CONN_START, url};
}

export function wsSendMessage(payload) {
  return {type: WS_SEND_MSG, payload};
}
