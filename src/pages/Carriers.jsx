import React, { Component } from 'react';
import { db } from '../firebase.js';
import NewCarrier from './NewCarrier.jsx';
import Spinner from '../components/Spinner.jsx'
import { Alert, Table, PageHeader, Button } from 'react-bootstrap';
function GetCarriers({carriers}) {
  var carrierList = [];
  carriers.forEach(carrier => {
    var data = carrier.data();
    carrierList.push(
      <tr key={carrier.id}>
        <td>{data.name}</td>
        <td>{data.address}</td>
        <td>{data.phone}</td>
      </tr>
    )
  })
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Название</th>
          <th>Адрес</th>
          <th>Номер телефона</th>
        </tr>
      </thead>
      <tbody>
        {carrierList}
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
      carriers: null
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
    db().collection('carriers')
    .orderBy('createdAt', 'desc')
    .get()
    .then(carriers => {
      this.setState({
        loading: false,
        carriers: carriers
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
            <strong>Перевозчик успешно создан!</strong>
          </Alert> : ""
        }
        <PageHeader>
          Перевозчики&nbsp;&nbsp;
          <Button onClick={() => { this.setState({ showModal: true }) }} bsStyle="primary">Добавить перевозчика</Button>
        </PageHeader>
        <NewCarrier showAlert={this.showAlert} showModal={this.state.showModal} handleHide={this.handleHide} />
        <GetCarriers carriers={this.state.carriers} />
      </div>
    );
  }
}

export default Clients;
