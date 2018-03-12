import React, { Component } from 'react';
import { auth } from '../firebase.js';
import { Redirect } from 'react-router-dom';
import Spinner from './Spinner.jsx';
class Logout extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false
    }
  }
  componentDidMount() {
    auth().signOut().then(() => {
      this.setState({
        redirect: true
      })
    })
  }
  render() {
    if(!this.state.redirect) {
      return (
        <div className="loading-cover">
          <Spinner />
        </div>
      );
    }
    return (
      <Redirect to='/' />
    )
  }
}

export default Logout;
