import {combineReducers} from 'redux';
import {connection} from './connectionReducer';
import {messages} from './messagesReducer';

const fileApp = combineReducers({
  connection,
  messages
});

export default fileApp;
