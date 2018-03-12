import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import { Form, HelpBlock, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { Select, Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact';
import './NewOrder.css';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}
function Cities({cities}) {
  var cityOptions = [];
  cityOptions.push(<option key="">Выберите город</option>);
  cities.forEach(city => {
    cityOptions.push(<option key={city.id} value={city.data().name}>{city.data().name}</option>)
  })
  return cityOptions;
}
function Currencies({currencies}) {
  var currencyOptions = [];
  currencyOptions.push(<option key="">Выберите валюту</option>);
  currencies.forEach(currency => {
    currencyOptions.push(<option key={currency.id} value={currency.data().code}>{currency.data().code}</option>)
  })
  return currencyOptions;
}
class NewClient extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      redirect: false,
      cities: null,
      phone: null,
      currencies: null,
      currency: null,
      city: null,
      name: null,
      lastName: null,
      loading: true
    };
  };
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  };
  onSubmit(e) {
    e.preventDefault();
    db().collection('clients').add({
      name: this.state.name,
      lastName: this.state.lastName,
      currency: this.state.currency,
      phone: this.state.phone,
      city: this.state.city,
      createdAt: db.FieldValue.serverTimestamp()
    }).then(() => {
      this.props.handleHide();
      this.props.showAlert();
    })
  }
  componentDidMount() {
    Promise.all([
      db().collection('cities').get(),
      db().collection('currencies').get()
    ]).then(([cities, currencies]) => {
      this.setState({
        cities: cities,
        currencies: currencies,
        loading: false
      });
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
        <Redirect to='/clients' />
      )
    }
    return (
        <Modal
          isOpen={this.props.showModal}
          toggle={this.handleHide}
        >
          <ModalHeader toggle={this.handleHide}>Modal title</ModalHeader>
          <ModalBody>
            <form>
              <p className="h5 text-center mb-4">Sign up</p>
              <Input label="Имя" name="name" icon="user" group type="text" validate error="wrong" success="right"/>
              <Input label="Фамилия" name="lastName" icon="envelope" group type="text" validate error="wrong" success="right"/>
              <Input label="Номер телефона" icon="lock" group type="number" validate/>
              <Input label="Номер телефона" icon="lock" group type="text" validate/>
              <div className="text-center">
                  <Button color="deep-orange">Sign up</Button>
              </div>
          </form>

          </ModalBody>
          <ModalFooter>
            <Button onClick={this.props.handleHide}>Close</Button>
            <Button onClick={this.onSubmit} type="submit" bsStyle="primary">Создать клиента</Button>
          </ModalFooter>
        </Modal>
    );
  }
}

export default NewClient;
