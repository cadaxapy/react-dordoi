import React, { Component } from 'react';
import { auth, db } from '../firebase.js';
import { Redirect } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Spinner from '../components/Spinner.jsx';
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
      authorized: false,
      loading: true,
      permission: true
    }
  }
  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if(!user) {
        return this.setState({
          loading: false
        })
      }
      var usersRef = db().collection('users');
      return usersRef.doc(user.uid).get().then(doc => {
        if(!doc.exists) {
          return this.setState({
            permission: false,
            loading: false
          });
        }
        this.setState({
          authorized: true,
          loading: false
        })
      });
    })
  }
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    if(this.state.authorized) {
      return (
        <Redirect to='/' />
      )
    }
    if(!this.state.permission) {
      return(
        <h1>Отказано в доступе</h1>
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
