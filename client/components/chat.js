import React, {Component, PropTypes} from 'react';

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
      <div>
        {this.props.connection.connected ? 'WS connected': 'offline'}
        <button 
          disabled={!this.props.connection.connected}
          onClick={() => this.props.boundWsConnectionStop()}>
            Stop websocket
        </button>

        <button 
          disabled={!this.props.connection.connected}
          onClick={() => this.sendMessage('normal', 'hithere')}>
            Send a Message to Server
        </button>

        <button 
          disabled={!this.props.connection.connected}
          onClick={() => this.props.boundLocalConnStart()}>
            Create WebRTC Endpoint
        </button>
      </div>
    );
  }
}

