import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import fileApp from './reducers/fileapp';
import {wsMiddleware} from './middleware/wsMiddleware';
import {webrtcMiddleware} from './middleware/webrtcMiddleware';
import config from '../config';

let middleware = config.reduxLog ? 
                 applyMiddleware(createLogger(), wsMiddleware, webrtcMiddleware) :
                 applyMiddleware(wsMiddleware, webrtcMiddleware);

let store = createStore(fileApp, middleware);
export default store;
