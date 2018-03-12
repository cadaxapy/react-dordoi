import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import './Spinner.css';

class MySpinner extends Component {
  render() {
    return (
      <div className='loading-cover'>
        <Spinner fadeIn='none' name='ball-pulse-rise' color="aqua"/>
      </div>
    );
  }
}

export default MySpinner;
