import React, { Component } from 'react';
import 'firebase/auth';

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

  submitSignUpForm(e) {
    e.preventDefault();
    const form = document.getElementById('signUp-form');

    this.props.firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then( (data) => {
      const {user} = data;
      if(user) {
        user.updateProfile({
          displayName: this.state.name
        }).then( () => {
          this.setState({
            name: '',
            email: '',
            password: '',
            passwordConfirm: ''
          });
          form.style.visibility = "hidden";
        })
      }
    })
    .catch(error => {
      this.setState({ error });
    });
  }

  submitSignInForm(e) {
    e.preventDefault();
    const form = document.getElementById('signIn-form');

    this.props.firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then( () => {
      this.setState({
        email: '',
        password: '',
      });
    })
    .catch(error => {
      this.setState({ error });
    });
    form.style.visibility = "hidden";
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
          <div className="name-info">
            <label><strong>Name</strong></label>
            <input type="text" id="name" name="name" value={this.state.name} placeholder="Name" onChange={ (e) => this.handleName(e) } required/>
          </div>
          <div className="email-info">
            <label><strong>Email</strong></label>
            <input type="email" id="email" name="email" value={this.state.email} placeholder="Email" onChange={ (e) => this.handleEmail(e) } required/>
          </div>
          <div className="password-info">
            <label><strong>Password</strong></label>
            <input type="password" id="password" name="password" value={this.state.password} placeholder="Password" onChange={ (e) => this.handlePassword(e) } required/>
          </div>
          <div className="password-info">
            <label><strong>Confirm Password</strong></label>
            <input type="password" id="password-repeat" name="password-repeat" value={this.state.passwordConfirm} placeholder="Repeat Password" onChange={ (e) => this.confirmPassword(e) } required/>
          </div>
          <button type="submit" className="button submit-btn">Sign Up</button>
          <button type="submit" className="button cancel-btn" onClick={(e) => this.cancelSignUp(e)}>Cancel</button>
        </form>

        <form id="signIn-form" onSubmit={(e) => this.submitSignInForm(e)}>
          <h4>Welcome back!</h4>
          <div className="email-info">
            <label><strong>Email</strong></label>
            <input type="email" id="email-signin" name="email-signin" value={this.state.email} placeholder="Email" onChange={ (e) => this.handleEmail(e) } required/>
          </div>
          <div className="password-info">
            <label><strong>Password</strong></label>
            <input type="password" id="password-signin" name="password-signin" value={this.state.password} placeholder="Password" onChange={ (e) => this.handlePassword(e) } required/>
          </div>
          <button type="submit" className="button submit-btn">Log In</button>
          <button type="submit" className="button cancel-btn" onClick={(e) => this.cancelSignIn(e)}>Cancel</button>
        </form>
      </section>
    );
  }
}

export default User;
