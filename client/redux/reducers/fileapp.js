import {combineReducers} from 'redux';
import {connection} from './connectionReducer';
import {webrtc} from './webrtcReducer';

const fileApp = combineReducers({
  connection,
  webrtc
});

export default fileApp;
