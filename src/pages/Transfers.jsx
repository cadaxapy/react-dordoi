import React, { Component } from 'react';
import { db } from '../firebase.js';
import NewTransfer from './NewTransfer.jsx';
import Spinner from '../components/Spinner.jsx'
import { Alert, Table, PageHeader, Button } from 'react-bootstrap';
function GetTransfers({transfers}) {
  var transferList = [];
  const i = 0;
  for(let i in transfers) {
    const data = transfers[i].data();
    transferList.push(
      <tr key={i}>
        <td>{data.client.name}</td>
        <td>{data.user.name}</td>
        <td>{data.amount}</td>
        <td>{data.createdAt.toString()}</td>
      </tr>
    )
  }
  transfers.forEach(transfer => {
    var data = transfer.data();

  })
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>клиента</th>
          <th>Переводчик</th>
          <th>Сумма(Сом)</th>
          <th>Время перевода</th>
        </tr>
      </thead>
      <tbody>
        {transferList}
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
      transfers: null
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
    db().collection('transfers')
    .orderBy('createdAt', 'desc')
    .get()
    .then(transfers => {
      this.setState({
        loading: false,
        transfers: transfers.docs
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
            <strong>Перевод выполнен!</strong>
          </Alert> : ""
        }
        <PageHeader>
          Переводыы&nbsp;&nbsp;
          <Button onClick={() => { this.setState({ showModal: true }) }} bsStyle="primary">Добавить клиента</Button>
        </PageHeader>
        <NewTransfer showAlert={this.showAlert} showModal={this.state.showModal} handleHide={this.handleHide} />
        <GetTransfers transfers={this.state.transfers} />
      </div>
    );
  }
}

export default Clients;
