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
        <ul>
          {this.state.messages.map( (message) => {
            if (message.roomId === this.props.setActiveRoom) {
              return <li key={ message.key }>{message.content} <br />
                <span><em>{message.username}</em></span>
              </li>
              }
              return (null);
            })
          }
        </ul>
        <form onSubmit={this.createMessage}>
          <input type="text" value={this.state.content} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

}

export default MessageList;
