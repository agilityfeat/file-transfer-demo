import {
  LOCAL_CONN_START,
  DATA_CHANNEL_CREATE,
  DATA_CHANNEL_OPEN,
  DATA_CHANNEL_CLOSE,
  REMOTE_CONN_START,
  REMOTE_DATA_CHANNEL_OK
} from '../actions/webrtcActions';

const initialState = {
  connecting: false,
  connected: false,
  iceCandidates: []
}

export function webrtc(state = initialState, action) {
  switch(action.type) {
    case LOCAL_CONN_START:
    case DATA_CHANNEL_CREATE:
      return Object.assign({}, state, {
        connecting: true,
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
