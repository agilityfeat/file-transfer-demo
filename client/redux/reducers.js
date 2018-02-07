import {combineReducers} from 'redux';
import {
  CONNECT_WS,
  SEND_MESSAGE,
  SEND_FILE
} from './actions';

function connection(state = false, action) {
  switch(action.type) {
    case CONNECT_WS:
      return !state;
    default:
      return state;
  }
}

function messages(state = [], action) {
  switch(action.type) {
    case SEND_MESSAGE:
      return [
        ...state, 
        {
          message: action.message, 
          timestamp: action.timestamp,
          author: action.author
        }
      ]
    default:
      return state;
  }
}

function files(state = [], action) {
  switch(action.type) {
    case SEND_FILE:
      return [
        ...state, 
        {
          file: action.file, 
          timestamp: action.timestamp,
          author: action.author
        }
      ]
    default:
      return state;
  }
}

const fileApp = combineReducers({
  connection,
  messages,
  files
});

export default fileApp;
