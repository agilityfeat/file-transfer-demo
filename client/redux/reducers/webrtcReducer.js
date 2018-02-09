import {
  CONN_START,
  OFFER_CREATE,
  OFFER_RECV,
  ICE_RECV,
  DATA_CHANNEL_CREATE,
  DATA_CHANNEL_OPEN,
  DATA_CHANNEL_CLOSE
} from '../actions/webrtcActions';

const initialState = {
  connecting: false,
  connected: false,
  channel: null
}

export function webrtc(state = initialState, action) {
  switch(action.type) {
    case CONN_START:
    case DATA_CHANNEL_CREATE:
      return Object.assign({}, state, {
        connecting: true,
        channel: action.name
      });
    case DATA_CHANNEL_OPEN:
      return Object.assing({}, state, {
        connecting: false,
        connected: true
      });
    default:
      return state;
  }
}
