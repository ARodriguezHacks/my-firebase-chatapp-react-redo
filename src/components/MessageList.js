import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      username: '',
      content: '',
      sentAt: '',
      roomId: ''
    };

    this.messagesRef = this.props.firebase.database().ref('messages');
    this.handleChange = this.handleChange.bind(this);
    this.createMessage = this.createMessage.bind(this);

  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) });
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      username: this.props.currentUser,
      content: e.target.value,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      roomId: this.props.setActiveRoom
    });
  }

  createMessage(e) {
    e.preventDefault();
    this.messagesRef.push({
      username: this.state.username,
      content: this.state.content,
      sentAt: this.state.sentAt,
      roomId: this.state.roomId
    });

    this.setState({ username: '', content: '', sentAt: '', roomId: '' });
  }
  
  render() {
    return(
      <div>
        <div className="message-margin overflow-auto">
          <h4 className="d-inline-block">Messages</h4>
          <ul className="list-unstyled overflow-auto messages-container">
            {this.state.messages.map( (message) => {
              if (message.roomId === this.props.setActiveRoom) {
                return (
                <div className="border bg-white mb-1 shadow-sm" key={message.key}>
                  <li>{message.content} <br />
                    <span><strong><em>{message.username}</em></strong></span>
                  </li>
                </div>)
                }
                return (null);
              })
            }
          </ul>
        </div>
        <div className="form-margin">
          <form onSubmit={this.createMessage}>
            <label>New Message</label> <br />
            <div className="message-area">
              <textarea className="message-box" rows="4" value={this.state.content} onChange={this.handleChange} required></textarea>
              <button type="submit" className="btn btn-blue"><img src="/assets/images/icons8-email-send-50-2.png" width="20%" alt="send-email icon"/></button>
            </div>
          </form>
        </div>
      </div>
    );
  }

}

export default MessageList;
