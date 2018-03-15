import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact';
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
      clients: null,
      orderId: null,
      redirect: false,
      client: {
        id: null,
        name: null
      },
      users: null,
      user: {
        id: null,
        name: null
      }
    }
  }
  componentDidMount() {
    Promise.all([
      db().collection('clients').get(),
      db().collection('users').get()
    ])
    .then(([clients, users]) => {
      this.setState({
        loading: false,
        clients: clients,
        users: users
      })
    });
  }
  onSubmit(e) {
    e.preventDefault();
    db().collection('orders').add({
      user: this.state.user,
      client: this.state.client,
      status: 'active',
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
      clientOptions.push({value: client.id, label: client.data().name});
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
    this.setState({
      client: {
        id: e.value,
        name: e.label
      }
    });
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
      <Button onClick={this.onSubmit} type="submit" bsstyle="primary">Создать Заказ</Button>
      </form>
    );
  }
}

export default NewOrder;
