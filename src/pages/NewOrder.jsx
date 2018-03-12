import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact';
import './NewOrder.css';


class NewOrder extends Component {
  constructor() {
    super();
    this.getClients = this.getClients.bind(this);
    this.onClientSelect = this.onClientSelect.bind(this);
    this.state = {
      loading: true,
      clients: null,
      client: null,
      currentClient: null
    }
  }
  componentDidMount() {
    db().collection('clients').get()
    .then(clients => {
      this.setState({
        loading: false,
        clients: clients
      })
    })
  }
  getClients() {
    var clients = this.state.clients;
    var clientOptions = [];
    clients.forEach(clients => {
      clientOptions.push({value: clients.id, label: clients.data().name});
    });
    return clientOptions;
  }
  onClientSelect(e) {
    this.setState({
      currentClient: e.value,
      client: {
        id: e.value,
        name: e.label
      }
    });
  }
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    return (
      <form>
        <h3 className="h5 text-center mb-4">Новый заказ</h3>
        <h4>Клиент</h4>
        <Select
          name="client"
          value={this.state.currentClient}
          onChange={this.onClientSelect}
          options={this.getClients()}
          searchable={true}
        />
        <br/>
        <h4>Пользователь</h4>
        <Select
          name="client"
          value={this.state.currentClient}
          onChange={this.onClientSelect}
          options={this.getClients()}
          searchable={true}
        />
        <Input label="Фамилия" onChange={this.onChange} name="lastName" icon="envelope" group type="text" validate error="wrong" success="right"/>
        <Input label="Номер телефона" onChange={this.onChange} icon="lock" group type="number" validate/>
      </form>
    );
  }
}

export default NewOrder;
