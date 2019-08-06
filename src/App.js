import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'
import User from './components/User'
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';

var config = {
  apiKey: "AIzaSyBAaW9_hM4BHhPehRY3olFsxZi14eR5YAI",
  authDomain: "my-firebase-react-chatapp.firebaseapp.com",
  databaseURL: "https://my-firebase-react-chatapp.firebaseio.com",
  projectId: "my-firebase-react-chatapp",
  storageBucket: "my-firebase-react-chatapp.appspot.com",
  messagingSenderId: "914805713857"
};

firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: '',
      user: '',
      editingRoom: false,
      value: ''
    };

    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.setUser = this.setUser.bind(this);
    this.roomsRef = firebase.database().ref('rooms');
  }

  setActiveRoom(room) {
    this.setState({ activeRoom: room });
  }

  editRoom() {
    this.setState({
      editingRoom: true,
      value: this.state.activeRoom.name
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      value: e.target.value
     });
  }

  handleSave(e) {
    e.preventDefault();
    this.roomsRef.child(this.state.activeRoom.key).update({name: this.state.value});
    this.setState({
      activeRoom: this.state.value,
      editingRoom: false,
      value: ''
    });
    console.log(this.state.value);
  }
/*
  updateCurrentRoom(e) {
    e.preventDefault();
    this.setState({
      activeRoom: this.state.value,
      editingRoom: false,
      value: ''
    });
  }
  */

  cancelSave(e) {
    e.preventDefault();
    this.setState({
      editingRoom: false
    });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  closeNav(e) {
    e.preventDefault();
    document.getElementById("mySidenav").style.width = "0";
  }
  //this.state.activeRoom.onClick = deleteRoom;

  render() {
    return (
      <div>
        <Navbar className="d-flex justify-content-between">
          <Navbar.Brand>Parle!</Navbar.Brand>
          <Nav>
            <li>
              <User firebase={firebase} currentUser={this.state.user} setUser={this.setUser} />
            </li>
          </Nav>
        </Navbar>
        <Container className="bg-secondary">

          <div className="mobile">
            <h2>Select Room to get started!</h2>
            <div id="mySidenav" className="sidenav text-center">
              <button className="closebtn" onClick={this.closeNav}>&times;</button>
                <h2>Your Rooms</h2>
                <RoomList firebase={firebase} activeRoom={this.state.activeRoom} setActiveRoom={this.setActiveRoom} currentUser={this.state.user} />
            </div>
            <button onClick={this.openNav} className="btn btn-info mobile">{`< Select Room`}</button>
          </div>

          <div className="non-mobile">
            <Row>
              <Col>
              <div id="mainSection">
                <h3>Current Room:</h3>
                { this.state.editingRoom ? (
                  <form onSubmit={(e) => this.handleSave(e)}>
                    <input type="text" value={this.state.value} onChange={(e) => this.handleChange(e)} />
                    <button type="submit">Save</button>
                    <button type="submit" onClick={(e) => this.cancelSave(e)}>Cancel</button>
                  </form>)
                : (<h4 id="currentRoomName">{this.state.activeRoom.name || this.state.activeRoom || null }</h4>) 
                }
              { firebase.auth().currentUser && this.state.activeRoom ? (
                <div>
                  <Button variant="success" onClick={ () => this.editRoom(this.state.activeRoom) }>Edit Room</Button>
                  <Button variant="danger" onClick={ () => this.deleteRoom(this.state.activeRoom.key, this.props.activeRoom.name) }>Delete Room</Button>
                </div>) : null }
              </div>
                <RoomList firebase={firebase} activeRoom={this.state.activeRoom} setActiveRoom={this.setActiveRoom} currentUser={this.state.user} roomChange={this.state.value} />
              </Col>
              <Col>
                { this.state.activeRoom ?
                    (<MessageList firebase={firebase} setActiveRoom={this.state.activeRoom.key}  currentUser={this.state.user ? this.state.user.displayName : 'Guest'} />) : (null)
                }
              </Col>
            </Row>
            </div>
        </Container>
      </div>
    );
  }
}

export default App;
