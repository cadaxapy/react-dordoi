import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx';
import OrderStatus from '../components/OrderStatus.jsx';
import {PageLink, Pagination, PageItem, Button, Card, CardBody, CardImage, CardTitle, CardText } from 'mdbreact';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super();
    this.getProducts = this.getProducts.bind(this);
    this.state = {
      orders: null,
      selectedOrderId: null,
      loading: true
    };
  }
  componentDidMount() {
    db().collection('orders')
    .orderBy('status', 'asc')
    .orderBy('createdAt', 'desc')
    .get().then(orders => {
      this.setState({
        orders: orders,
        loading: false
      });
    });
  }
  openOrder(id) {
    this.setState({
      selectedOrderId: id,
      redirect: true
    })
  }
  getProducts() {
    var orders = this.state.orders;
    var cards = [];
    orders.forEach(order => {
      var data = order.data();
      cards.push(<Card>
          {/*<CardImage className="img-fluid" src="/assets/purchase-order.png" />*/}
          <CardBody>
              <CardTitle>{order.id}</CardTitle>
              <CardText><OrderStatus status={data.status}/></CardText>
              <Button onClick={(e) => {this.openOrder(order.id)}}>Открыть заказ</Button>
          </CardBody>
      </Card>);
    });
    return cards;
  }
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    if(this.state.redirect) {
      return (
        <Redirect to={'/order/' + this.state.selectedOrderId} />
      )
    }
    return (
      <div className='container-fluid'>
        <div className="row">

          <div className="col-8">
            <h2 className='text-center'>Заказы</h2>
            {this.getProducts()}
            <br />
            <Pagination className="justify-content-center pagination-lg">
              <PageItem disabled>
                <PageLink className="page-link" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only">Previous</span>
                </PageLink>
              </PageItem>
              <PageItem active>
                <PageLink className="page-link">
                  1 <span className="sr-only">(current)</span>
                </PageLink>
              </PageItem>
              <PageItem>
                <PageLink className="page-link">
                  &raquo;
                </PageLink>
              </PageItem>
            </Pagination>
          </div>

          <div className="col">
              <h2 className='text-center'>Переводы</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
