import React, { Component } from 'react';
import { db } from '../firebase.js';
import NewClient from './NewClient.jsx';
import Spinner from '../components/Spinner.jsx'
import { Alert, Table, PageHeader, Button } from 'react-bootstrap';
function GetClients({clients}) {
  var clientList = [];
  clients.forEach(client => {
    var data = client.data();
    clientList.push(
      <tr key={client.id}>
        <td>{data.name}</td>
        <td>{data.lastName}</td>
        <td>{data.phone}</td>
        <td>{data.city.name}</td>
        <td>{data.currency.name}</td>
      </tr>
    )
  })
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Номер телефона</th>
          <th>Город</th>
          <th>Валюта</th>
        </tr>
      </thead>
      <tbody>
        {clientList}
      </tbody>
    </Table>
  )
}
class Clients extends Component {
  constructor() {
    super();
    this.handleHide = this.handleHide.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.state = {
      loading: true,
      showModal: false,
      alert: false,
      clients: null,
    };
  };
  showAlert() {
    this.setState({
      alert: true
    })
  }
  handleHide() {
    this.setState({ showModal: false });
  }
  componentDidMount() {
    db().collection('clients')
    .orderBy('createdAt', 'desc')
    .get()
    .then(clients => {
      this.setState({
        loading: false,
        clients: clients
      });
    });
  }
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    return (
      <div className='view'>
        {this.state.alert ?
          <Alert bsStyle="success" onDismiss={() => {
            this.setState({
              alert: false
            })
          }}>
            <strong>Клиент успешно создан!</strong>
          </Alert> : ""
        }
        <PageHeader>
          Клиенты&nbsp;&nbsp;
          <Button onClick={() => { this.setState({ showModal: true }) }} bsStyle="primary">Добавить клиента</Button>
        </PageHeader>
        <NewClient showAlert={this.showAlert} showModal={this.state.showModal} handleHide={this.handleHide} />
        <GetClients clients={this.state.clients} />
      </div>
    );
  }
}

export default Clients;
