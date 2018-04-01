import React, { Component } from 'react';
import { db } from '../firebase.js';
import NewClient from './NewClient.jsx';
import { Redirect } from 'react-router-dom';
import Spinner from '../components/Spinner.jsx'
import { Alert, Table, PageHeader, Button } from 'react-bootstrap';
function GetClients({clients, redirectToClient}) {
  var clientList = [];
  clients.forEach(client => {
    var data = client.data();
    clientList.push(
      <tr key={client.id}>
        <td><a onClick={e => {redirectToClient(client.id)}}>{data.name}</a></td>
        <td>{data.lastName}</td>
        <td>{data.phone}</td>
        <td>{data.city.name}</td>
        <td>{data.currency}</td>
        <td>{data.budget}</td>
        <td><Button color="cyan" onClick={e => {redirectToClient(client.id)}}>Показать</Button></td>
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
          <th>Бюджет</th>
          <th>Детальная информация</th>
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
    this.redirectToClient = this.redirectToClient.bind(this);
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
  redirectToClient(clientId) {
    this.setState({
      redirect: true,
      redirectClientId: clientId
    });
  }
  handleHide() {
    this.setState({ showModal: false });
  }
  componentDidMount() {
    db().collection('clients')
    .orderBy('createdAt', 'desc')
    .onSnapshot(clients => {
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
    if(this.state.redirect) {
      return (
        <Redirect to={'/client/' + this.state.redirectClientId} />
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
        <GetClients clients={this.state.clients} redirectToClient={this.redirectToClient} />
      </div>
    );
  }
}

export default Clients;
