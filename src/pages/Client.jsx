import React, { Component } from 'react';
import { db } from '../firebase.js';
import CustomSpinner from '../components/Spinner.jsx';
import Spinner from 'react-spinkit';
import OrderCard from '../components/OrderCard.jsx';
import 'react-select/dist/react-select.css';
import { Button } from 'mdbreact';
import './Client.css';
class Client extends Component {
  constructor() {
    super();
    this.getOrderPriceSum = this.getOrderPriceSum.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.getOrdersFromDb = this.getOrdersFromDb.bind(this);
    this.getMoreOrders = this.getMoreOrders.bind(this);
    this.state = {
      loading: true,
      ordersAreLoading: true,
      client: null,
      orders: [],
    }
  }
  handleHide() {
    this.setState({ showProduct: false });
  }
  getOrderPriceSum() {
    return parseInt(this.state.commission, 10) + parseInt(this.state.carrierCommission, 10) + this.state.sumOfProducts;
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    const clientDoc = db().collection('clients').doc(params.clientId);
    clientDoc.get().then(client => {
      this.setState({
        client: client,
        loading: false
      });
    });
    this.getOrdersFromDb();
  };
  getMoreOrders() {
    this.setState({
      ordersAreLoading: true
    });
    this.getOrdersFromDb(this.state.lastOrderId);
  }
  getOrdersFromDb(lastOrderId) {
    const { match: { params } } = this.props;
    var orderRef;
    if(!lastOrderId) {
      orderRef = db().collection('orders')
      .where('client.id', '==', params.clientId)
      .limit(30)
    } else {
      orderRef = db().collection('orders')
      .where('client.id', '==', params.clientId)
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
  getOrders() {
    var orders = this.state.orders;
    var cards = [];
    for(let i in orders) {
      cards.push(
        <div className='col-4'>
          <OrderCard order={orders[i]}/>
        </div>
      )
      if((i + 1) % 3 === 0) {
        cards.push(<div className="w-100"><br/></div>);
      }
    }
    cards.push(<div className="w-100"></div>);
    if(this.state.ordersAreLoading) {
      cards.push(
        <div className='col text-center'>
          <Spinner fadeIn='none' name='line-scale' color="aqua"/>
        </div>
        );
    } else {
      cards.push(
        <div className='col text-center'>
          <br/>
          <Button onClick={this.getMoreOrders}>Загрузить еще</Button>
        </div>
      );
    }
    return cards;
  }
  render() {
    if(this.state.loading) {
      return (
        <CustomSpinner />
      )
    }
    if(!this.state.client.exists) {
      return (
        <h1>Not found</h1>
      )
    }
    var clientData = this.state.client.data();
    return (
      <div className="container">
        <div className="row">
          <div className='col'>
            <h2 className='text-center'>Информация о клиенте</h2>
            <div className='border rounded z-depth-1 h-70 w-70 container'>
              <div className="row">
                <div className='col'>
                  <img alt="" className='blank-profile' src="/assets/blank-profile.png" />
                </div>
                <div className='col'>
                  <br />
                  <p className='h5'>Имя: {clientData.name}</p>
                  <br />
                  <p className='h5'>Фамилия: {clientData.lastName}</p>
                  <br />
                  <p className='h5'>Номер телефона: {clientData.phone}</p>
                </div>
                <div className='col'>
                  <br />
                  <p className='h5'>Город: {clientData.city.name}</p>
                  <br />
                  <p className='h5'>Валюта: {clientData.currency.name}</p>
                  <br />
                  <p className='h5'>Бюджет: {clientData.budget}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <br />
            <h2 className='text-center'>Заказы клиента</h2>
            <div className='border rounded z-depth-1 h-70 w-70 container'>
              <br/>
              <div className="row">
                {this.getOrders()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Client;
