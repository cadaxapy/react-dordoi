import React, { Component } from 'react';
import { db } from '../firebase.js';
import Spinner from 'react-spinkit';
import getTime from '../helpers/time.js';
import { Card, CardText, CardBody, CardTitle, Button } from 'mdbreact';
import OrderCard from '../components/OrderCard.jsx';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super();
    this.getOrders = this.getOrders.bind(this);
    this.getMoreOrders = this.getMoreOrders.bind(this);
    this.state = {
      orders: [],
      selectedOrderId: null,
      lastOrderId: null,
      ordersAreLoading: true,
      transfersAreLoading: true
    };
  }
  componentDidMount() {
    this.GetOrdersFromDb();
    db().collection('transfers')
    .orderBy('createdAt', 'desc')
    .get()
    .then(transfers => {
      this.setState({
        transfers: transfers,
        transfersAreLoading: false
      });
    });
  }
  GetOrdersFromDb(lastOrderId) {
    var orderRef;
    if(!lastOrderId) {
      orderRef = db().collection('orders')
      .orderBy('status', 'asc')
      .orderBy('createdAt', 'desc')
      .limit(30)
    } else {
      orderRef = db().collection('orders')
      .orderBy('status', 'asc')
      .orderBy('createdAt', 'desc')
      .startAfter(lastOrderId)
      .limit(30)
    }
    return orderRef.get().then(orders => {
      if(orders.empty) {
        return this.setState({
          ordersAreLoading: false
        });
      }
      this.setState(prevState => ({
        lastOrderId: orders.docs[orders.docs.length - 1],
        orders: prevState.orders.concat(orders.docs),
        ordersAreLoading: false
      }));
    });
  }
  openOrder(id) {
    this.setState({
      selectedOrderId: id,
      redirect: true
    })
  }
  getMoreOrders() {
    this.setState({
      ordersAreLoading: true
    });
    this.GetOrdersFromDb(this.state.lastOrderId);
  }
  getOrders() {
    var orders = this.state.orders;
    var cards = [];
    orders.forEach(order => {
      cards.push(<OrderCard order={order}></OrderCard>);
    });
    if(this.state.ordersAreLoading) {
      cards.push(<Spinner className="text-center" fadeIn='none' name='line-scale' color="aqua"/>);
    } else {
      cards.push(
        <div className='text-center'>
          <br/>
          <Button onClick={this.getMoreOrders}>Загрузить еще</Button>
        </div>
      );
    }
    return cards;
  }
  GetTransfers() {
    if(this.state.transfersAreLoading) {
      return (
        <Spinner className="text-center" fadeIn='none' name='line-scale' color="aqua"/>
      )
    }
    var transfers = this.state.transfers;
    var cards = [];
    transfers.forEach(transfer => {
      var data = transfer.data();
      cards.push(<Card>
          {/*<CardImage className="img-fluid" src="/assets/purchase-order.png" />*/}
          <CardBody>
              <CardTitle>{transfer.id}</CardTitle>
              <CardText>
                Клиент: {data.client.name}<br/>
                Переводчик: {data.user.name}<br/>
                Сумма: {data.amount}<br/>
                Создано: {getTime(data.createdAt)}<br/>
              </CardText>
          </CardBody>
      </Card>);
    });
    return cards;
  }
  render() {
    return (
      <div className='container-fluid'>
        <div className="row">
          <div className="col-8">
            <h2 className='text-center'>Заказы</h2>
            {this.getOrders()}
          </div>
          <div className="col">
              <h2 className='text-center'>Последние 10 переводов</h2>
              {this.GetTransfers()}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
