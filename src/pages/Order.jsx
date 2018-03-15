import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import ProductsModal from '../components/ProductModal.jsx';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact';
import './NewOrder.css';
class NewOrder extends Component {
  constructor() {
    super();
    this.handleHide = this.handleHide.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.state = {
      loading: true,
      user: null,
      showProduct: false,
      products: null,
      client: null,
      order: null
    }
  }
  handleHide() {
    this.setState({ showProduct: false });
  }
  getProducts() {
    var products = this.state.products;
    var productRows = [];
    products.forEach(product => {
      var data = product.data();
      productRows.push(
        <tr>
          <td>{data.name}</td>
          <td>{data.amount}</td>
          <td>{data.price}</td>
          <td>{data.sum}</td>
        </tr>
      );
    })
    return productRows;
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    const orderDoc = db().collection('orders').doc(params.orderId);
    orderDoc.get().then(order => {
      Promise.all([
        db().collection('clients').doc(order.data().client.id).get(),
        db().collection('users').doc(order.data().user.id).get()
      ]).then(([client, user]) => {
        this.setState({
          client: client,
          user: user,
          order: order,
          loading: false
        });
      });
    });
    orderDoc.collection('products')
    .onSnapshot(products => {
      this.setState({
        products: products
      });
    });
  };
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    if(!this.state.order.exists) {
      return (
        <h1>Not found</h1>
      )
    }
    var order = this.state.order;
    var clientData = this.state.client.data();
    var userData = this.state.user.data();
    return (
      <div>
        <ProductsModal order={order} getProducts={this.getProducts} showModal={this.state.showProduct} handleHide={this.handleHide} />
        <div className='border rounded z-depth-3 h-50 w-50 container'>
          <h1 className='text-center'>{"Заказ №" + order.id}</h1>
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td>Статус</td>
                <td>{order.data().status}</td>
              </tr>
              <tr>
                <td>Клиент</td>
                <td>{clientData.name + ', ' + clientData.city.name}</td>
              </tr>
              <tr>
                <td>Сотрудник</td>
                <td>{userData.name +', '+ userData.phone}</td>
              </tr>
              <tr>
                <td>Комиссия</td>
                <td>{order.data().commission}</td>
              </tr>
              <tr>
                <td>Товары</td>
                <td>
                  <Button onClick={(e) => {this.setState({showProduct: true})}} color='primary'>Показать</Button>
                </td>
              </tr>
            </tbody>
          </Table>
          <Button bsstyle="primary">Создать Заказ</Button>
        </div>
      </div>
    );
  }
}

export default NewOrder;
