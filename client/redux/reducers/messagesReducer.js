import {
  SEND_MESSAGE
} from '../actions/fileActions.js';

export function messages(state = [], action) {
  switch(action.type) {
    case SEND_MESSAGE:
      return [
        ...state, 
        {
          message: action.message, 
          timestamp: action.timestamp,
          sender: action.uuid
        }
      ]
    default:
      return state;
  }
}
