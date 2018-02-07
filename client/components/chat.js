import React, {Component, PropTypes} from 'react';

export default class Chat extends Component {
  constructor() {
    super();
  }

  render() {
    console.log('props', this.props);
    return(
      <div>Hi u it</div>
    );
  }
}

