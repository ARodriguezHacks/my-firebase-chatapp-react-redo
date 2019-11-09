import React, { Component } from 'react';

//var firebaseui = require('firebaseui');

//var ui = new firebaseui.auth.AuthUI(firebase.auth());

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signUp: false,
      email: '',
      password: ''
    }

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  startSignUp() {
    const form = document.getElementById('signUp-form');
    form.style.visibility = "visible";
  }

  signIn() {
    const provider = new this.props.firebase.auth.signInWithEmailAndPassword()
    this.props.firebase.auth().signInWithPopup( provider );
  }

  signOut() {
    this.props.firebase.auth().signOut();
  }

  handleEmail(email) {

    this.setState({
      email: email
    });

    const provider = new this.props.firebase.auth.createUserWithEmailAndPassword();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  handlePassword(password) {
    this.setState({
      password: password
    });
  }

  handleChange(user) {
    const signInStatus = user;
    if (signInStatus) {
      this.signOut();
    } else if (signInStatus === null){
      this.signIn();
    }
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
    });
  }

  render() {
    return (
      <section>
        <h4>Welcome {(this.props.currentUser) ? this.props.currentUser.displayName : 'Guest'}!</h4>
        <button onClick={this.signIn}
        onChange={(user) => this.handleChange(user)}>
        {(this.props.currentUser) === null ?
          <span>Log In</span> :
          <span>Signed In</span>
        }
        </button>
        <button onClick={this.startSignUp}
          onChange={() => this.handleSignUp()}>
            Sign up
        </button>
        <form id="signUp-form">
          <h4>Sign in to start chatting</h4>
          <label><strong>Email</strong></label>
          <input type="email" id="email" name="email" value={this.state.email} placeholder="Email" />
          <label><strong>Password</strong></label>
          <input type="password" id="password" name="password" value={this.state.password} placeholder="Password" />
          <button type="submit" class="button">Log In</button>
        </form>
        {(this.props.currentUser) !== null ? <button onClick={this.signOut}>Sign Out</button> : (null) }
      </section>
    );
  }
}

export default User;
