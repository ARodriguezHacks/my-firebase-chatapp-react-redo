import React, { Component } from 'react';

class User extends Component {
  constructor(props) {
    super(props);

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  signIn() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  signOut() {
    this.props.firebase.auth().signOut();
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
          <span>Sign Up/Log In</span> :
          <span>Signed In</span>
        }
        </button>
        {(this.props.currentUser) !== null ? <button onClick={this.signOut}>Sign Out</button> : (null) }
      </section>
    );
  }
}

export default User;
