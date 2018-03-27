import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Button } from 'mdbreact';

import './NewOrder.css';

class NewOrder extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.getClients = this.getClients.bind(this);
    this.onClientSelect = this.onClientSelect.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.onUserSelect = this.onUserSelect.bind(this);
    this.state = {
      loading: true,
      orderId: null,
      carriers: null,
      orderPriceSum: 0,
      carrierCommission: 0,
      validate: true,
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
      selectedUsers: []
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
    var selectedUsers = this.state.selectedUsers;
    if(!this.state.client.id || selectedUsers.length === 0) {
      return this.setState({
        validate: false
      })
    }
    var userIds = {};
    for(let i in selectedUsers) {
      userIds[selectedUsers[i].value] = true;
    }
    db().collection('orders').add({
      client: this.state.client,
      users: userIds,
      status: 0,
      createdAt: db.FieldValue.serverTimestamp()
    }).then((orderRef) => {
      this.setState({
        redirect: true,
        orderId: orderRef.id
      });
    });
  }

  getClients() {
    var clients = this.state.clients;
    var clientOptions = [];
    clients.forEach(client => {
      clientOptions.push({cityName: client.data().city.name, value: client.id, label: client.data().name});
    });
    return clientOptions;
  }

  getUsers() {
    var users = this.state.users;
    var userOptions = [];
    users.forEach(user => {
      userOptions.push({value: user.id, label: user.data().phone});
    });
    return userOptions;
  }

  onClientSelect(e) {
    var selectedClientCity = '';
    this.state.clients.forEach(client => {
      if(client.id === e.value) {
        selectedClientCity = client.data().city;
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
  onUserSelect(value) {
    this.setState({
      selectedUsers: value
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
  					multi
  					onChange={this.onUserSelect}
            removeSelected={this.state.removeSelected}
            options={this.getUsers()}
  					value={this.state.selectedUsers}
  				/>
          <br/>
          {!this.state.validate
            ? <p style={{color: 'red'}}>ошибка валидации</p>
            : ''
          }
          <Button onClick={this.onSubmit} type="submit" bsstyle="primary">Создать Заказ</Button>
        </form>
      </div>
    );
  }
}

export default NewOrder;
