import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Container, ListGroup } from 'react-bootstrap';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      name: '',
      username: '',
      editedRoom: ''
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
  }

  componentUnMounted() {
    this.roomsRef.on('child_removed', snapshot => {
      const roomToDelete = snapshot.val();
      roomToDelete.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.splice(roomToDelete.key, 1) });
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

/* In progress: creating a function that will update rooms state dynamically when room name is edited
  updateRoomChange(e, room) {
    e.preventDefault();
    room.name = this.props.activeRoom;
    //var roomIndex = this.state.rooms.findIndex( (room) => {
      //return (room.key === this.props.activeRooom.key && room.name !== this.props.activeRooom.name) 
    //});

    this.setState({
      rooms: this.state.rooms.splice(room.key, 1, room)
    });
  }
  */

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

  render() {
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
              <ListGroup.Item key={room.key} onClick={() => this.props.setActiveRoom(room)} onChange={(e, room) => this.updateRoomChange(e, room)}>
              { room.name }</ListGroup.Item>
            )}
            </ListGroup>
        </Container>
      </section>
    )
  }
}

export default RoomList;
