import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';

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
    console.log(this.state.activeRoom.name);
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
                <RoomList firebase={firebase} activeRoom={this.state.activeRoom} setActiveRoom={this.setActiveRoom} currentUser={this.state.user} />
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
