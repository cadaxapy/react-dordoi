import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import './Spinner.css';

class OrderStatus extends Component {
  render() {
    var status = this.props.status;
    if(status == 0) {
      return (
        <span style={{color: 'green'}}>Активный</span>
      )
    }
    return (
      <span style={{color: 'red'}}>Завершен</span>
    );
  }
}

export default OrderStatus;
