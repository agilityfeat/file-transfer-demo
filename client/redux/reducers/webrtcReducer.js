import {
  CONN_START,
  OFFER_CREATE,
  OFFER_RECV,
  ICE_RECV,
  DATA_CHANNEL_CREATE,
  DATA_CHANNEL_OPEN,
  DATA_CHANNEL_CLOSE,
  DC_MSG_RECV,
  DC_MSG_SEND
} from '../actions/webrtcActions';

const initialState = {
  connecting: false,
  connected: false,
  messages: []
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
      return Object.assign({}, state, {
        connecting: false,
        connected: true
      });
    case DC_MSG_SEND:
    case DC_MSG_RECV:
      return Object.assign({}, state, {
        messages: [...state.messages, action.payload],
      });
    default:
      return state;
  }
}
