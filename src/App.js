import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import RoomList from './components/RoomList'
import MessageList from './components/MessageList'

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
      activeRoom: ''
    };

    this.setActiveRoom = this.setActiveRoom.bind(this);
  }

  setActiveRoom(room) {
    this.setState({ activeRoom: room });
  }

  render() {
    return (
      <div>
        <h1>Welcome to the Chat!</h1>
        <h2>{this.state.activeRoom.name || "Select Chat Room"}</h2>
        <RoomList firebase={firebase} setActiveRoom={this.setActiveRoom} />
        { this.state.activeRoom ?
          (<MessageList firebase={firebase} setActiveRoom={this.state.activeRoom.key} />) : (null)
        }
      </div>
    );
  }
}

export default App;
