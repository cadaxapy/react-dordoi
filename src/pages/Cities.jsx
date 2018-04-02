import React, { Component } from 'react';
import { db } from '../firebase.js';
import NewCity from './NewCity.jsx';
import Spinner from '../components/Spinner.jsx'
import { Alert, Table, PageHeader, Button } from 'react-bootstrap';
function GetCities({cities}) {
  var cityList = [];
  cities.forEach(city => {
    var data = city.data();
    cityList.push(
      <tr key={city.id}>
        <td>{data.name}</td>
      </tr>
    )
  })
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Название</th>
        </tr>
      </thead>
      <tbody>
        {cityList}
      </tbody>
    </Table>
  )
}
class Cities extends Component {
  constructor() {
    super();
    this.handleHide = this.handleHide.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.state = {
      loading: true,
      showModal: false,
      alert: false,
      cities: null
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
    db().collection('cities')
    .onSnapshot(cities => {
      this.setState({
        loading: false,
        cities: cities
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
            <strong>Город успешно добавлен!</strong>
          </Alert> : ""
        }
        <PageHeader>
          Города&nbsp;&nbsp;
          <Button onClick={() => { this.setState({ showModal: true }) }} bsStyle="primary">Добавить город</Button>
        </PageHeader>
        <NewCity showAlert={this.showAlert} showModal={this.state.showModal} handleHide={this.handleHide} />
        <GetCities cities={this.state.cities} />
      </div>
    );
  }
}

export default Cities;
