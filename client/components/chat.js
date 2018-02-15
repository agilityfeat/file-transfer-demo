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
      <div className="col-md-6 col-md-offset-3">
        <div className="col-md-12 text-center">
          <h3>{websocket.connected ? 'WebSocket Connected': 'Offline'}</h3>
          <h3>{`${websocket.peersAvailable} Peers Available`}</h3>
          <h3>{webrtc.connecting ? 'Connecting WebRTC...': 
               webrtc.connected  ? 'WebRTC Connected' : 'Data Channel Inactive'}</h3>
        </div>
        <div className="col-md-6 col-md-offset-3 btn-container">
          <button 
            className="btn btn-info col-md-12"
            disabled={!websocket.connected || websocket.peersAvailable < 1 || webrtc.connected}
            onClick={() => this.props.boundLocalConnStart()}>
              Open Data Channel
          </button>

          <button 
            className="btn btn-danger col-md-12"
            disabled={!webrtc.connected}
            onClick={() => this.props.boundWsConnectionStop()}>
              Stop Websocket
          </button>
        </div>
        <div className="col-md-6 col-md-offset-3">
          <Messages 
            uuid={websocket.uuid}
            sendMessage={this.props.boundChannelSend}
            messages={webrtc.messages}
            connected={webrtc.connected}/>
        </div>
      </div>
    );
  }
}

