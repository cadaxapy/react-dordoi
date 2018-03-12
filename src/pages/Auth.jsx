import React, { Component } from 'react';
import { auth, db } from '../firebase.js';
import { Redirect } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import './Auth.css';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: 'KG',
      recaptchaParameters: {
        size: 'invisible'
      }
    }
  ],
};

class Auth extends Component {
  constructor() {
    super();
    this.state = {
      authorized: false
    }
  }
  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if(user) {
        var usersRef = db().collection('users');
        return usersRef.doc(user.uid).get().then(doc => {
          if(!doc.exists) {
            usersRef.doc(user.uid).set({
              phone: user.phoneNumber
            });
          }
          this.setState({
            authorized: true
          })
        });
      }
    })
  }
  render() {
    if(this.state.authorized) {
      return (
        <Redirect to='/' />
      )
    }
    return (
      <div className="container">
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
      </div>
    )
  }
}

export default Auth;
