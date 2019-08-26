import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Container, ListGroup,  } from 'react-bootstrap';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      name: '',
      username: ''
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });

    this.roomsRef.on('child_changed', snapshot => {
      const updatedRoom = snapshot.val();
      updatedRoom.key = snapshot.key;
      let roomsCopy = JSON.parse(JSON.stringify(this.state.rooms));
      var item = roomsCopy.find( item => item.key === updatedRoom.key);
      item.name = updatedRoom.name;
      this.setState({rooms: roomsCopy});
    });

    this.roomsRef.on('child_removed', snapshot => {
      const roomToDelete = snapshot.val();
      console.log(roomToDelete);
      roomToDelete.key = snapshot.key;
      let roomsCopy = JSON.parse(JSON.stringify(this.state.rooms));
      var items = roomsCopy.filter( item => item.key !== roomToDelete.key);
      this.setState({rooms: items});
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ name: e.target.value, username: this.props.currentUser.displayName});
  }

  createRoom(e) {
    e.preventDefault();
    this.roomsRef.push({
      name: this.state.name,
      username: this.state.username
    });
    this.setState({ name: '', username: '' });
  }
/*
  deleteRoom(deleteKey, deleteName) {
    const deletingRoom = this.roomsRef.child(deleteKey);
    var output = [];

    this.messagesRef.on('value', (snapshot) => {
      snapshot.forEach( (childSnapshot) => {
        var mysnap = childSnapshot.val();
        mysnap.key = childSnapshot.key;
        output.push(mysnap);
      });
    });

    output.filter( childitem => {
      if (childitem.roomId === deleteKey) {
        var removeMessage = this.messagesRef.child(childitem.key);
        removeMessage.remove();
      }
      return null;
    });

    deletingRoom.remove(function(error) {
      alert(error ? "failed" : deleteName + " successfully deleted!");
    });

    this.props.setActiveRoom("");
    const otherRooms = this.state.rooms.filter(room => room.key !== deleteKey);
    this.setState({ rooms: otherRooms});
  }
*/
  render() {
    //const filteredList = this.filter(this.state.rooms);
    return (
      <section>       
        { firebase.auth().currentUser ? (
        <form onSubmit={ (e) => this.createRoom(e) }>
          <label>Create New Room</label>
          <input type="text" id="room" value={this.state.name} onChange={ (e) => this.handleChange(e) } />
          <button type="submit">Create Room</button>
        </form>) : (<p>Please sign in to create chat rooms!</p>)
      }
        <h4>Your rooms:</h4>
        <Container className="overflow-auto rooms-container">
            <ListGroup>
            {this.state.rooms.map( (room) =>
              <ListGroup.Item key={room.key} onClick={() => this.props.setActiveRoom(room)}>
              { room.name }</ListGroup.Item>
            )}
            </ListGroup>
        </Container>
      </section>
    )
  }
}

export default RoomList;
