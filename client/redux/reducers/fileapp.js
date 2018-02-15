import {combineReducers} from 'redux';
import {websocket} from './wsReducer';
import {webrtc} from './webrtcReducer';

const fileApp = combineReducers({
  websocket,
  webrtc
});

export default fileApp;
