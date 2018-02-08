import {connect} from 'react-redux';
import {wsConnectionStart, WS_CONN_STOP, WS_SEND_MSG} from '../redux/actions/wsActions';
import Chat from '../components/chat';

function mapStateToProps(state, ownState) {
  return {
    files: state.files,
    messages: state.messages,
    connection: state.connection
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    boundWsConnectionStart: (url) => dispatch(wsConnectionStart(url)),
    boundWsConnectionStop:  () => dispatch({type: WS_CONN_STOP}),
    boundWsSendMessage:     (payload) => dispatch({type: WS_SEND_MSG, payload})
  }
}

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(Chat);
export default ChatContainer;
