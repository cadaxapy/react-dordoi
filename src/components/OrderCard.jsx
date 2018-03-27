import React, { Component } from 'react';
import {Card, CardTitle, CardBody, CardText, Button} from 'mdbreact';
import { Redirect } from 'react-router-dom';
import OrderStatus from './OrderStatus';

class OrderCard extends Component {
  constructor() {
    super();
    this.openOrder = this.openOrder.bind(this);
    this.state = {
      redirect: false,
      selectedOrderId: null
    }
  };
  openOrder(id) {
    this.setState({
      selectedOrderId: id,
      redirect: true
    })
  };
  render() {
    var order = this.props.order;
    var data = order.data();
    if(this.state.redirect) {
      return (
        <Redirect to={'/order/' + this.state.selectedOrderId} />
      )
    }
    return (
      <Card>
        {/*<CardImage className="img-fluid" src="/assets/purchase-order.png" />*/}
        <CardBody>
            <CardTitle>{order.id}</CardTitle>
            <CardText><OrderStatus status={data.status}/></CardText>
            <Button onClick={(e) => {this.openOrder(order.id)}}>Открыть заказ</Button>
        </CardBody>
      </Card>
    );
  }
}

export default OrderCard;
