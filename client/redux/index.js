import {createStore} from 'redux';
import fileApp from './reducers';

let store = createStore(fileApp);
export default store;
