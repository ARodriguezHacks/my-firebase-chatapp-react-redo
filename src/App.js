import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase'
import RoomList from './components/RoomList'

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
  render() {
    return (
      <div>
        <h1>Welcome to the Chat!</h1>
        <RoomList firebase={firebase} />
      </div>
    );
  }
}

export default App;
