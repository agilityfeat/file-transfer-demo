import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {encode, decode} from 'base64-arraybuffer';

export default class Messages extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      chunks: [],
      file: null,
    }

    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.sendFile = this.sendFile.bind(this);
  }

  handleMessageSubmit(type) {
    return (e) => {
      e.preventDefault();

      const {file, message} = this.state;

      if(file !== null) 
        this.sendFile(file, 0, 1000);
      else
        this.props.sendMessage({
          type,
          content: message,
          author: this.props.uuid,
          timestamp: Date.now()
        });

      this.setState({
        message: '',
        file: null
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.messages.length < this.props.messages.length){
      let {messageBox} = this.refs;
      messageBox.scrollTop = messageBox.scrollHeight + 300;
    }
  }


  renderMessages(messages) {
    let {uuid} = this.props;
    return _.map(messages, (m, i) => {
      let cn = m.author === uuid ? "message-user" : "message-guest";
      let sn = m.author === uuid ? "You" : "Someone";
      switch(m.type) {
        case "message":
          return <p className={`message ${cn}`} key={`m-${i}`}><strong className={cn}>{sn}:</strong> {m.content}</p>;
        case "file-end":
          return m.filetype.indexOf("image") !== -1 ? 
          (<p className={`message ${cn}`} key={`m-${i}`}>
            <strong className={cn}>{sn}:</strong> <a target="_blank" className="img-container" href={m.content}><img src={m.content}/></a>
          </p>) :
          (<p className={`message ${cn}`} key={`m-${i}`}>
            <strong className={cn}>{sn}:</strong> <a target="_blank" href={m.content}>download {m.filetype} file.</a>
          </p>);
      }
    });
  }

  sendFile(file, offset, chunksize) {
    let reader = new FileReader();

    reader.onload = (e) => {
      let {result} = e.target;
      result = result.split(",")[1];
      let chunks = result.match(/.{1,19000}/g);
      _.forEach(chunks, (chunk) => {
        this.props.sendMessage({
          type: "file",
          content: chunk,
          author: this.props.uuid,
          timestamp: Date.now()
        });
      })
      this.props.sendMessage({
          type: "file-end",
          content: file.type,
          author: this.props.uuid,
          timestamp: Date.now()
      });
    }
    
    reader.readAsDataURL(file);
  }

  render() {
    const {file} = this.state;
    const {connected, messages} = this.props;
    return(
      <div className="messages-window-container col-md-12 col-sm-12 col-xs-12">
        <div ref="messageBox" className="messages-window" id="messages-window">
          {this.renderMessages(this.props.messages)}
        </div>
        <div className="btn-container-input">
          <form onSubmit={this.handleMessageSubmit("message")}>
            <input
              className="form-control col-md-12"
              disabled={!connected}
              type="text"
              placeholder="Send a message"
              value={this.state.message}
              onChange={(e) => this.setState({message: e.target.value})}/>
            <div className="input-btn-wrapper col-md-12 col-xs-12">
              <button 
                type="submit"
                className="btn btn-success"
                disabled={!connected || (this.state.message === '' && file === null)}>
                  Send Message
              </button>
              <div className="upload-btn-wrapper">
                <input 
                  type="file"
                  id="file-to-upload"
                  style={{display: "none"}}
                  onChange={(e) => this.setState({file: e.target.files[0]})}
                  disabled={!connected || file !== null}/>
                <label 
                  role="button"
                  htmlFor="file-to-upload"
                  disabled={!connected || file !== null}
                  className="btn btn-success">{file !== null ? file.name : "Upload File"}</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
