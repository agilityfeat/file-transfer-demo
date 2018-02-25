import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import fileApp from './reducers/fileapp';
import {wsMiddleware} from './middleware/wsMiddleware';
import {webrtcMiddleware} from './middleware/webrtcMiddleware';

let store = createStore(fileApp, applyMiddleware(createLogger(), wsMiddleware, webrtcMiddleware));
export default store;
