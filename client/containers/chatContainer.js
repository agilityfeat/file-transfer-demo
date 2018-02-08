import {connect} from 'react-redux';
import {
  wsConnectionStart, 
  WS_CONN_STOP, 
  WS_SEND_MSG
} from '../redux/actions/wsActions';

import {
  LOCAL_CONN_START
} from '../redux/actions/webrtcActions';
import Chat from '../components/chat';

function mapStateToProps(state, ownState) {
  return {
    webrtc: state.webrtc,
    connection: state.connection
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    boundWsConnectionStart: (url) => dispatch(wsConnectionStart(url)),
    boundWsConnectionStop:  () => dispatch({type: WS_CONN_STOP}),
    boundWsSendMessage:     (payload) => dispatch({type: WS_SEND_MSG, payload}),
    boundLocalConnStart:    () => dispatch({type: LOCAL_CONN_START})
  }
}

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(Chat);
export default ChatContainer;
