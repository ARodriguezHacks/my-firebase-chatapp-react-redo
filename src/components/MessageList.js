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

  //<input type="text" id="message" value={this.state.content} onChange={this.handleChange} />
  render() {
    return(
      <div>
        <form onSubmit={this.createMessage}>
          <label>New Message</label> <br />
          <textarea id="message" className="message-box" placeholder="New Message" value={this.state.content} onChange={this.handleChange}></textarea>
          <input type="submit" className="btn-blue" value="Submit" />
        </form>
        <div className="message-margin">
          <h4>Messages</h4>
          <ul className="list-unstyled">
            {this.state.messages.map( (message) => {
              if (message.roomId === this.props.setActiveRoom) {
                return (
                <div className="border bg-info mb-2" key={message.key}>
                  <li>{message.content} <br />
                    <span><em>{message.username}</em></span>
                  </li>
                </div> )
                }
                return (null);
              })
            }
          </ul>
        </div>
      </div>
    );
  }

}

export default MessageList;
