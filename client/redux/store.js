import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import fileApp from './reducers/fileapp';
import {wsMiddleware} from './middleware/wsMiddleware';

let store = createStore(fileApp, applyMiddleware(createLogger(), thunk, wsMiddleware));
export default store;
