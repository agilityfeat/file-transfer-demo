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

  sendMessage(type, message) {
    const {connection, boundWsSendMessage} = this.props;

    if(connection.connected) {
      boundWsSendMessage({
        type,
        message,
        uuid: connection.uuid
      });
    }
  }

  render() {
    return(
      <div className="col-md-6 col-md-offset-3">
        <div className="col-md-12 text-center">
          <h3>{this.props.connection.connected ? 'WebSocket Connected': 'Offline'}</h3>
          <h3>{this.props.webrtc.connecting ? 'Connecting WebRTC...': 
               this.props.webrtc.connected  ? 'WebRTC Connected' : 'Data Channel Inactive'}</h3>
        </div>
        <div className="col-md-6 col-md-offset-3 btn-container">
          <button 
            className="btn btn-info col-md-12"
            disabled={!this.props.connection.connected}
            onClick={() => this.props.boundLocalConnStart()}>
              Open Data Channel
          </button>

          <button 
            className="btn btn-danger col-md-12"
            disabled={!this.props.connection.connected}
            onClick={() => this.props.boundWsConnectionStop()}>
              Stop Websocket
          </button>
        </div>
        <div className="col-md-6 col-md-offset-3">
          <Messages 
            uuid={this.props.connection.uuid}
            sendMessage={this.props.boundChannelSend}
            messages={this.props.webrtc.messages}
            connected={this.props.webrtc.connected}/>
        </div>
      </div>
    );
  }
}

