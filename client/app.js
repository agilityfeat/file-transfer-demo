import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/index'
import ChatContainer from './containers/chatContainer';

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <ChatContainer/>
      </div>
    </Provider>
  );
}

export default App;
