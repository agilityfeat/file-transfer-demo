import React, {Component, PropTypes} from 'react';
import Messages from './messages';
import config from '../config';

export default class Chat extends Component {
  constructor() {
    super();
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.props.boundWsConnectionStart(config.wsUrl);
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
        <div className="header col-md-12 col-xs-12">
          <div className="pull-right text-center status-container col-xs-12 col-md-8">
            <p className="pull-right text-center col-xs-12 col-md-3">{websocket.connected ? 'WebSocket Connected': 'WebSocket Offline'}</p>
            <p className="pull-right text-center col-xs-12 col-md-3">{`${websocket.peersAvailable} Peers Available`}</p>
            <p className="pull-right text-center col-xs-12 col-md-3">{webrtc.connecting ? 'Connecting WebRTC...': 
                 webrtc.connected  ? 'WebRTC Peer Connected' : 'WebRTC Inactive'}</p>
          </div>
          <div className="btn-container col-xs-12 col-md-4">
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

