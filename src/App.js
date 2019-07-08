import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'
import User from './components/User'
import { Container, Row, Col } from 'react-bootstrap';

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
      user: ''
    };

    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setActiveRoom(room) {
    this.setState({ activeRoom: room });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  //this.state.activeRoom.onClick = deleteRoom;

  render() {
    return (
      <Container className="bg-secondary">
        <Row className="bg-warning">
          <Col>
            <h2>Parle!</h2>
          </Col>
          <Col>
            <User firebase={firebase} currentUser={this.state.user} setUser={this.setUser} />
          </Col>
        </Row>
        <div id="mySidenav" className="sidenav">
          <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Clients</a>
          <a href="#">Contact</a>
        </div>

        <span onClick={this.openNav}>open</span>
        <Row>
          <div className="col-5 bg-success">
            <h2>Select Chat Room</h2>
            <RoomList firebase={firebase} activeRoom={this.state.activeRoom} setActiveRoom={this.setActiveRoom} currentUser={this.state.user} />
          </div>
          <div className="col-7">
            { this.state.activeRoom ?
                (<MessageList firebase={firebase} setActiveRoom={this.state.activeRoom.key}  currentUser={this.state.user ? this.state.user.displayName : 'Guest'} />) : (null)
            }
          </div>
        </Row>
      </Container>
      
    );
  }
}

export default App;
