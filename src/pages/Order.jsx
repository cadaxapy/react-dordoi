import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import OrderStatus from '../components/OrderStatus.jsx';
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
    this.onOrderChange = this.onOrderChange.bind(this);
    this.onCarrierSelect = this.onCarrierSelect.bind(this);
    this.getOrderPriceSum = this.getOrderPriceSum.bind(this);
    this.getInputCarrier = this.getInputCarrier.bind(this);
    this.state = {
      loading: true,
      user: null,
      showProduct: false,
      products: null,
      validate: true,
      commission: 0,
      carrierCommission: 0,
      sumOfProducts: 0,
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
          <td>{data.amount}</td>
          {
            this.state.order.data().status == 0 ?
            <td><a href="#" className='btn btn-warning .btn-xs' onClick={() => {
              productRef.delete();
            }}>Удалить</a></td> : ''
          }
        </tr>
      );
    })
    return productRows;
  }
  getOrderPriceSum() {
    console.log(this.state.sumOfProducts);
    return parseInt(this.state.commission) + parseInt(this.state.carrierCommission) + this.state.sumOfProducts;
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
      var sumOfProducts = 0;
      products.forEach(product => {
        sumOfProducts += product.data().amount;
      });
      this.setState({
        sumOfProducts: sumOfProducts,
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
  onOrderChange(e) {
    var value = e.target.value
    if(value == '') {
      value = 0;
    }
    this.setState({
      [e.target.name]: value
    })
  }
  getInputCarrier() {
    if(this.state.order.data().status == 0) {
      return (
        <Select name="client" placeholder="Выберите перевозчика" value={this.state.selectedCarrier.id}  onChange={this.onCarrierSelect} options={this.getCarriers()}  searchable={true} />
      );
    }
    return;
  }
  updateOrder(e) {
    e.preventDefault();
    const commission = parseInt(this.state.commission);
    const carrierCommission = parseInt(this.state.carrierCommission);
    if(commission <= 0 || carrierCommission <= 0 || !this.state.selectedCarrier.id) {
      return this.setState({
        validate: false
      });
    }
    var orderPriceSum = this.getOrderPriceSum();
    db().collection('orders').doc(this.state.order.id).update({
      status: 1,
      commission: parseInt(this.state.commission),
      carrier: this.state.selectedCarrier,
      carrierCommission: parseInt(this.state.carrierCommission),
      orderPriceSum: orderPriceSum,
      createdAt: db.FieldValue.serverTimestamp()
    }).then(() => {
      var clientRef = db().collection('clients').doc(this.state.client.id);
      db().runTransaction(transaction => {
        return transaction.get(clientRef)
        .then(clientDoc => {
          var newBudget = clientDoc.data().budget - orderPriceSum;
          return transaction.update(clientRef, {budget: newBudget});
        });
      }).catch(e => {
        console.log(e);
      });
    });
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
                <td><OrderStatus status={order.data().status}/></td>
              </tr>
              <tr>
                <td>Клиент</td>
                <td>{clientData.name + ', ' + clientData.city.name}</td>
              </tr>
              <tr>
                <td>Бюджет клиента</td>
                <td>{clientData.budget - this.getOrderPriceSum()}</td>
              </tr>
              <tr>
                <td>Сотрудник</td>
                <td>{userData.name +', '+ userData.phone}</td>
              </tr>
              <tr>
                <td>Комиссия</td>
                <td>
                  {order.data().status == 0
                    ? <Input type="number" inputmode="numeric" onChange={this.onOrderChange} name="commission" group validate error="wrong" success="right"/>
                    : order.data().commission
                  }
                </td>
              </tr>
              <tr>
                <td>Перевозчики</td>
                <td>
                  {this.getInputCarrier()}
                </td>
              </tr>
              {this.state.selectedCarrier.id != null ?
                <tr>
                  <td>Комиссия за перевод</td>
                  <td>
                    <Input onChange={this.onOrderChange} name="carrierCommission" group type="number" validate error="wrong" success="right"/>
                  </td>
                </tr> : ''
              }

              <tr>
                <td>Общая сумма</td>
                <td>
                  {
                    order.data().status == 0
                    ?<input disabled onChange={this.onOrderChange} type="number" value={this.getOrderPriceSum()} className="form-control form-control-sm"/>
                    :order.data().orderPriceSum
                  }
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
          {!this.state.validate
            ? <p style={{color: 'red'}}>ошибка валидации</p>
            : ''
          }
          {
            order.data().status == 0
            ? <Button onClick={this.updateOrder} bsstyle="primary">Создать Заказ</Button>
            : ''
          }

        </div>
      </div>
    );
  }
}

export default NewOrder;
