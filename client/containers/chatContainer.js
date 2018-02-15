import {connect} from 'react-redux';
import {
  wsConnectionStart, 
  WS_CONN_STOP, 
  wsSendMessage
} from '../redux/actions/wsActions';

import {
  CONN_START,
  channelSend
} from '../redux/actions/webrtcActions';
import Chat from '../components/chat';

function mapStateToProps(state, ownState) {
  return {
    webrtc: state.webrtc,
    websocket: state.websocket
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    boundWsConnectionStart: (url) => dispatch(wsConnectionStart(url)),
    boundWsConnectionStop:  () => dispatch({type: WS_CONN_STOP}),
    boundWsSendMessage:     (payload) => wsSendMessage(payload),
    boundLocalConnStart:    () => dispatch({type: CONN_START}),
    boundChannelSend:       (payload) => dispatch(channelSend(payload))
  }
}

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(Chat);
export default ChatContainer;
