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

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.messages.length < this.props.messages.length){
      let {messageBox} = this.refs;
      messageBox.scrollTop = messageBox.scrollHeight + 300;
    }
  }

  renderMessages(messages) {
    return _.map(messages, (m, i) => {
      let cn = m.author === this.props.uuid ? "message-user" : "message-guest";
      let sn = m.author === this.props.uuid ? "You" : "Someone";
      return <p className={`message ${cn}`} key={`m-${i}`}>{sn}: {m.content}</p>;
    });
  }

  render() {
    return(
      <div>
        <div ref="messageBox" className="messages-window" id="messages-window">
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
