import {connect} from 'react-redux';
import {connectWs, sendMessage} from '../redux/actions';
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
    boundConnectWs: (url) => dispatch(connectWs(url)),
    boundSendMessage: (args) => dispatch(sendMessage(args))
  }
}

const ChatContainer = connect(mapStateToProps, mapDispatchToProps)(Chat);
export default ChatContainer;
