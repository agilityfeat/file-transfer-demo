import React, {Component, PropTypes} from 'react';
import Messages from './messages';

export default class Chat extends Component {
  constructor() {
    super();
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.props.boundWsConnectionStart('ws://localhost:8080');
  }

  componentWillUnmount() {
    this.props.boundWsConnectionStop();
  }

  sendMessage(type, message) {
    const {websocket, boundWsSendMessage} = this.props;

    if(websocket.connected) {
      boundWsSendMessage({
        type,
        message,
        uuid: websocket.uuid
      });
    }
  }

  render() {
    let {websocket, webrtc} = this.props;
    return(
      <div className="main-container">
        <div className="header">
          <div className="pull-right status-container">
            <p className="pull-right">{websocket.connected ? 'WebSocket Connected': 'Offline'}</p>
            <p className="pull-right">{`${websocket.peersAvailable} Peers Available`}</p>
            <p className="pull-right">{webrtc.connecting ? 'Connecting WebRTC...': 
                 webrtc.connected  ? 'WebRTC Peer Connected' : 'WebRTC Inactive'}</p>
          </div>
          <div className="btn-container">
            <button 
              className="btn btn-info pull-left"
              disabled={!websocket.connected || websocket.peersAvailable < 1 || webrtc.connected}
              onClick={() => this.props.boundLocalConnStart()}>
                Open Data Channel
            </button>

            <button 
              className="btn btn-danger pull-left"
              disabled={!webrtc.connected}
              onClick={() => this.props.boundWsConnectionStop()}>
                Stop Websocket
            </button>
          </div>
        </div>
        <Messages 
          uuid={websocket.uuid}
          sendMessage={this.props.boundChannelSend}
          messages={webrtc.messages}
          connected={webrtc.connected}/>
      </div>
    );
  }
}

