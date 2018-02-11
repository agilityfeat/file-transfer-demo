import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

export default class Messages extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      file: null,
    }

    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
  }

  handleMessageSubmit(e) {
    e.preventDefault();

    this.props.sendMessage({
      content: this.state.message,
      author: this.props.uuid,
      timestamp: Date.now()
    });

    this.setState({
      message: '',
      file: null
    });
  }

  renderMessages(messages) {
    return _.map(messages, (m, i) => {
      let cn = m.author === this.props.uuid ? "message-user" : "message-guest";
      return <p className={`message ${cn}`} key={`m-${i}`}>{m.author.split('-')[0]}: {m.content}</p>;
    });
  }

  render() {
    return(
      <div>
        <div className="messages-window" id="messages-window">
          {this.renderMessages(this.props.messages)}
        </div>
        <div className="btn-container-input">
          <form onSubmit={this.handleMessageSubmit}>
            <input
              className="form-control col-md-12"
              disabled={!this.props.connected}
              type="text"
              placeholder="Send a message"
              value={this.state.message}
              onChange={(e) => {this.setState({message: e.target.value})}}/>
            <button 
              type="submit"
              className="btn btn-success col-md-6"
              disabled={!this.props.connected}>
                Send Message
            </button>
            <button 
              className="btn btn-info col-md-6"
              disabled={!this.props.connected}>
                Send File
            </button>
          </form>
        </div>
      </div>
    );
  }
}
