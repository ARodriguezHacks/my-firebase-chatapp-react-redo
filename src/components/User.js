import React, { Component } from 'react';
import 'firebase/auth';

//var firebaseui = require('firebaseui');

//var ui = new firebaseui.auth.AuthUI(firebase.auth());
//const provider = new this.props.firebase.auth.createUserWithEmailAndPassword();
 //   this.props.firebase.auth().signInWithPopup( provider );

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signUp: false,
      signIn: false,
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      error: null
    }

    //this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  startSignUp() {
    const form = document.getElementById('signUp-form');
    form.style.visibility = "visible";
  }

  startSignIn() {
    const form = document.getElementById('signIn-form');
    form.style.visibility = "visible";
  }

  signOut() {
    this.props.firebase.auth().signOut();
  }

  handleName(e) {
    e.preventDefault();
    this.setState({
      name: e.target.value
    });
  }

  handleEmail(e) {
    e.preventDefault();
    this.setState({
      email: e.target.value
    });
  }

  handlePassword(e) {
    e.preventDefault();
    this.setState({
      password: e.target.value
    });
  }

  confirmPassword(e) {
    e.preventDefault();
    this.setState({
      passwordConfirm: e.target.value
    });
  }

  //handleChange(user) {
    //const signInStatus = user;
    //if (signInStatus) {
      //this.signOut();
    //} else if (signInStatus === null){
      //this.signIn();
    //}
  //}

  submitSignUpForm(e) {
    e.preventDefault();
    //const provider = new this.props.firebase.auth.signInWithEmailAndPassword()
    const form = document.getElementById('signUp-form');

    this.props.firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then( () => {
      this.setState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
      });
      form.style.visibility = "hidden";
    })
    .catch(error => {
      this.setState({ error });
    });
  }

  submitSignInForm(e) {
    e.preventDefault();
    //const provider = new this.props.firebase.auth.signInWithEmailAndPassword()
    const form = document.getElementById('signIn-form');

    this.props.firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then( () => {
      this.setState({
        email: '',
        password: '',
      });
      form.style.visibility = "hidden";
    })
    .catch(error => {
      this.setState({ error });
    });
  }

  cancelSignUp(e) {
    e.preventDefault();
    const form = document.getElementById('signUp-form');
    form.style.visibility = "hidden";
  }

  cancelSignIn(e) {
    e.preventDefault();
    const form = document.getElementById('signIn-form');
    form.style.visibility = "hidden";
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
      console.log(user.displayName);
    });
  }

  render() {
    return (
      <section>
        <h4>Welcome {(this.props.currentUser) ? this.props.currentUser.displayName : 'Guest'}!</h4>
        <button>
        {(this.props.currentUser) === null ?
          <span onClick={this.startSignIn}>Log In</span> :
          <span>Signed In</span>
        }
        </button>
        {(this.props.currentUser) !== null ? 
          <button onClick={this.signOut}>Sign Out</button> :
          <button onClick={this.startSignUp}>Sign up</button>
        }
        <form id="signUp-form" onSubmit={(e) => this.submitSignUpForm(e)}>
          <h4>Sign up to start chatting</h4>
          <div class="name-info">
            <label for="name"><strong>Name</strong></label>
            <input type="text" id="name" name="name" value={this.state.name} placeholder="Name" onChange={ (e) => this.handleName(e) } required/>
          </div>
          <div class="email-info">
            <label for="email"><strong>Email</strong></label>
            <input type="email" id="email" name="email" value={this.state.email} placeholder="Email" onChange={ (e) => this.handleEmail(e) } required/>
          </div>
          <div class="password-info">
            <label for="password"><strong>Password</strong></label>
            <input type="password" id="password" name="password" value={this.state.password} placeholder="Password" onChange={ (e) => this.handlePassword(e) } required/>
          </div>
          <div class="password-info">
            <label for="password-repeat"><strong>Confirm Password</strong></label>
            <input type="password" id="password-repeat" name="password-repeat" value={this.state.passwordConfirm} placeholder="Repeat Password" onChange={ (e) => this.confirmPassword(e) } required/>
          </div>
          <button type="submit" class="button submit-btn">Sign Up</button>
          <button type="submit" class="button cancel-btn" onClick={(e) => this.cancelSignUp(e)}>Cancel</button>
        </form>

        <form id="signIn-form" onSubmit={(e) => this.submitSignInForm(e)}>
          <h4>Welcome back!</h4>
          <div class="email-info">
            <label for="email-signin"><strong>Email</strong></label>
            <input type="email" id="email-signin" name="email-signin" value={this.state.email} placeholder="Email" onChange={ (e) => this.handleEmail(e) } required/>
          </div>
          <div class="password-info">
            <label for="password-signin"><strong>Password</strong></label>
            <input type="password" id="password-signin" name="password-signin" value={this.state.password} placeholder="Password" onChange={ (e) => this.handlePassword(e) } required/>
          </div>
          <button type="submit" class="button submit-btn">Log In</button>
          <button type="submit" class="button cancel-btn" onClick={(e) => this.cancelSignIn(e)}>Cancel</button>
        </form>
      </section>
    );
  }
}

export default User;
