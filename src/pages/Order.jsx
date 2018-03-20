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
    this.updateOrder = this.updateOrder.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.state = {
      loading: true,
      user: null,
      showProduct: false,
      products: null,
      client: null,
      order: null,
      carriers: null,
      selectedCarrier: {
        id: null,
        name: null
      }
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
      var productRef = db().collection('orders').doc(this.state.order.id)
      .collection('products').doc(product.id);
      productRows.push(
        <tr key={product.id}>
          <td>{data.name}</td>
          <td>{data.amount}</td>
          <td>{data.price}</td>
          <td>{data.sum}</td>
          <td><a href="#" className='btn btn-warning .btn-xs' onClick={() => {
            productRef.delete();
          }}>Удалить</a></td>
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
        db().collection('users').doc(order.data().user.id).get(),
        db().collection('carriers').get()
      ]).then(([client, user, carriers]) => {
        this.setState({
          client: client,
          user: user,
          carriers: carriers,
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
  getCarriers() {
    var carriers = this.state.carriers;
    var carrierOptions = [];
    carriers.forEach(carrier => {
      carrierOptions.push({value: carrier.id, label: carrier.data().name});
    });
    return carrierOptions;
  }
  onCarrierSelect(e) {
    this.setState({
      selectedCarrier: {
        id: e.value,
        name: e.label
      }
    });
  }
  updateOrder() {
    console.log('test')
  }
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
                <td>Перевозчики</td>
                <td><Select
                  name="client"
                  placeholder="Выберите перевозчика"
                  value={this.state.selectedCarrier.id}
                  onChange={this.onCarrierSelect}
                  options={this.getCarriers()}
                  searchable={true}
                /></td>
              </tr>
              <tr>
                <td>Комиссия за перевод</td>
                <td>
                  <Input label="Название" name="productName" group type="text" validate error="wrong" success="right"/>
                </td>
              </tr>
              <tr>
                <td>Товары</td>
                <td>
                  <Button onClick={(e) => {this.setState({showProduct: true})}} color='primary'>Показать</Button>
                </td>
              </tr>
            </tbody>
          </Table>
          <Button onClick={this.updateOrder} bsstyle="primary">Создать Заказ</Button>
        </div>
      </div>
    );
  }
}

export default NewOrder;
