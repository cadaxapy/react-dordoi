import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact';
import ProductModal from '../components/ProductModal.jsx';

import './NewOrder.css';

class NewOrder extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.getClients = this.getClients.bind(this);
    this.onClientSelect = this.onClientSelect.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.onUserSelect = this.onUserSelect.bind(this);
    this.getCarriers = this.getCarriers.bind(this);
    this.onCarrierSelect = this.onCarrierSelect.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.onOrderChange = this.onOrderChange.bind(this);
    this.handleProductModal = this.handleProductModal.bind(this);
    this.state = {
      loading: true,
      orderId: null,
      carriers: null,
      orderPriceSum: 0,
      carrierCommission: 0,
      commission: 0,
      carrier: {
        id: null,
        name: null
      },
      showProductModal: false,
      products: [],
      redirect: false,
      clients: null,
      client: {
        id: null,
        name: null
      },
      users: null,
      user: {
        id: null,
        name: null,
        cityName: null
      }
    }
  }
  componentDidMount() {
    Promise.all([
      db().collection('clients').get(),
      db().collection('users').get(),
      db().collection('carriers').get(),
    ])
    .then(([clients, users, carriers]) => {
      this.setState({
        loading: false,
        clients: clients,
        users: users,
        carriers: carriers
      })
    });
  }
  onSubmit(e) {
    e.preventDefault();
    db().collection('orders').add({
      client: this.state.client,
      user: this.state.user,
      status: 0,
      createdAt: db.FieldValue.serverTimestamp()
    }).then((orderRef) => {
      this.setState({
        redirect: true,
        orderId: orderRef.id
      });
    });
  }
  addProduct(item) {
    const newProducts = this.state.products.concat([item]);
    console.log(newProducts);
    var sumOfProducts = 0;
    for(let i in newProducts) {
      sumOfProducts += parseInt(newProducts[i].sum);
    }
    this.setState({
      orderPriceSum: sumOfProducts + parseInt(this.state.carrierCommission) + parseInt(this.state.commission),
      products: newProducts
    });
  }
  deleteProduct(i) {
    var updatedProducts = this.state.products;
    var sumOfProduct = parseInt(updatedProducts[i].sum);
    updatedProducts.splice(i, 1);
    this.setState(prevState => ({
      orderPriceSum: prevState.orderPriceSum - sumOfProduct,
      products: updatedProducts
    }));
  }
  getClients() {
    var clients = this.state.clients;
    var clientOptions = [];
    clients.forEach(client => {
      clientOptions.push({cityName: client.data().city.name, value: client.id, label: client.data().name});
    });
    return clientOptions;
  }
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
      carrier: {
        id: e.value,
        name: e.label,
      }
    });
  }
  getUsers() {
    var users = this.state.users;
    var userOptions = [];
    users.forEach(user => {
      userOptions.push({value: user.id, label: user.data().phone});
    });
    return userOptions;
  }
  onOrderChange(e) {
    var sumOfProducts = 0;
    const products = this.state.products;
    for(let i in products) {
      sumOfProducts += parseInt(products[i].sum);
    }
    if(e.target.name == 'carrierCommission') {
      this.setState({
        [e.target.name]: e.target.value,
        orderPriceSum: sumOfProducts + parseInt(e.target.value) + parseInt(this.state.commission)
      });
    } else if(e.target.name == 'commission') {
      this.setState({
        [e.target.name]: e.target.value,
        orderPriceSum: sumOfProducts + parseInt(e.target.value) + parseInt(this.state.carrierCommission)
      })
    }
  }
  onClientSelect(e) {
    var selectedClientCity = '';
    this.state.clients.forEach(client => {
      if(client.id == e.value) {
        selectedClientCity = client.data().city.name;
        return true;
      }
    })
    this.setState({
      client: {
        id: e.value,
        name: e.label,
        cityName: selectedClientCity
      }
    });
  }
  handleProductModal() {
    this.setState(prevState => ({
      showProductModal: !prevState.showProductModal
    }));
  }
  onUserSelect(e) {
    this.setState({
      user: {
        id: e.value,
        name: e.label
      }
    })
  }
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    if(this.state.redirect) {
      return (
        <Redirect to={'/order/' + this.state.orderId} />
      )
    }
    return (
      <div>
        <form>
          <h3 className="h5 text-center mb-4">Новый заказ</h3>
          <h4>Клиент</h4>
          <Select
            name="client"
            value={this.state.client.id}
            onChange={this.onClientSelect}
            options={this.getClients()}
            searchable={true}
          />
          <br/>
          <h4>Пользователь</h4>
          <Select
            name="user"
            value={this.state.user.id}
            onChange={this.onUserSelect}
            options={this.getUsers()}
            searchable={true}
          />
          <br/>
          <Button onClick={this.onSubmit} type="submit" bsstyle="primary">Создать Заказ</Button>
        </form>
      </div>
    );
  }
}

export default NewOrder;
