import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Container, Row, Col, Button, ListGroup, ButtonGroup } from 'react-bootstrap';

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

  //editRoom(roomKey) {
    //console.log(this.roomsRef);
    //const roomToEdit = this.roomsRef.child(roomKey);
    //console.log(roomToEdit);
  //}
//
  updateRoom(roomKey) {
    const roomToEdit = this.roomsRef.child(roomKey);
    console.log(roomToEdit);
  }

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
      alert(error ? "failed" : deleteName + " successfully deleted!")
    });

    this.props.setActiveRoom("");
    const otherRooms = this.state.rooms.filter(room => room.key !== deleteKey);
    this.setState({ rooms: otherRooms});
  }

  render() {
    return (
      <section>
      <h3>Current Room: {this.props.activeRoom.name || null }</h3>
      { firebase.auth().currentUser && this.props.activeRoom ? (<button onClick={ () => this.deleteRoom(this.props.activeRoom.key, this.props.activeRoom.name) }>Delete Room</button>) : null }
      { firebase.auth().currentUser ? (
        <form onSubmit={ (e) => this.createRoom(e) }>
          <label>Create New Room</label>
          <input type="text" id="room" value={this.state.name} onChange={ (e) => this.handleChange(e) } />
          <button type="submit">Create Room</button>
        </form>) : (<p>Please sign in to create chat rooms!</p>)
      }
      <h4>Your rooms:</h4>
      <Container className="overflow-auto rooms-container">
          {this.state.rooms.map( (room) =>
            <ListGroup key={room.key}>
              <Row>
                <Col>
                  <ListGroup.Item id="roomId" onClick={() => this.props.setActiveRoom(room)}>{room.name}</ListGroup.Item>
                </Col>
                <Col>
                { firebase.auth().currentUser && this.props.activeRoom ? ( 
                  <ButtonGroup vertical>
                    <Button variant="success" className="mb-1" onClick={ () => this.updateRoom(this.props.activeRoom.key)}>
                    Edit</Button>
                    <Button variant="danger" onClick={ () => this.deleteRoom(this.props.activeRoom.key, this.props.activeRoom.name)}>Delete</Button>
                </ButtonGroup>
                ) : (null)
                }
                </Col>
              </Row>
            </ListGroup>
          )}
        </Container>
      </section>
    )
  }
}

export default RoomList;
