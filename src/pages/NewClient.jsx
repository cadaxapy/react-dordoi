import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact';
import './NewOrder.css';
class NewClient extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getCities = this.getCities.bind(this);
    this.getCurrencies = this.getCurrencies.bind(this);
    this.onCitySelect = this.onCitySelect.bind(this);
    this.onCurrencySelect = this.onCurrencySelect.bind(this);
    this.state = {
      redirect: false,
      cities: null,
      phone: null,
      currentCurrency: null,
      currentCity: null,
      currencies: null,
      currency: null,
      city: null,
      name: null,
      validate: true,
      lastName: '',
      loading: true
    };
  };
  getCurrencies() {
    var currencies = this.state.currencies;
    var currencyOptions = [];
    currencies.forEach(currency => {
      currencyOptions.push({value: currency.id, label: currency.data().name});
    })
    return currencyOptions;
  }
  getCities() {
    var cities = this.state.cities;
    var cityOptions = [];
    cities.forEach(city => {
      cityOptions.push({value: city.id, label: city.data().name});
    })
    return cityOptions;
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  };
  onCitySelect(e) {
    this.setState({
      currentCity: e.value,
      city: {
        id: e.value,
        name: e.label
      }
    });
  }
  onCurrencySelect(e) {
    this.setState({
      currentCurrency: e.value,
      currency: {
        id: e.value,
        name: e.label
      }
    })
  }
  onSubmit(e) {
    e.preventDefault();
    if(!this.state.name || !this.state.currency || !this.state.phone || !this.state.city) {
      return this.setState({
        validate: false
      })
    }
    db().collection('clients').add({
      name: this.state.name,
      lastName: this.state.lastName,
      currency: this.state.currency,
      budget: 0,
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
      <div>
        <Modal
          isOpen={this.props.showModal}
          toggle={this.props.handleHide}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.props.handleHide}>Клиент</ModalHeader>
          <ModalBody>

            <form>
              <p className="h5 text-center mb-4">Создать клиента</p>
              <Input label="Имя" onChange={this.onChange} name="name" group type="text" validate error="wrong" success="right"/>
              <Input label="Фамилия" onChange={this.onChange} name="lastName"  group type="text" validate error="wrong" success="right"/>
              <Input label="Номер телефона" onChange={this.onChange} name="phone" group type="text" validate/>
              <h3>Город</h3>
              <Select
                name="city"
                placeholder="Выберите город"
                value={this.state.currentCity}
                onChange={this.onCitySelect}
                options={this.getCities()}
              />
              <h3>Валюта</h3>
              <Select
                name="currency"
                placeholder="Выберите валюту"
                value={this.state.currentCurrency}
                onChange={this.onCurrencySelect}
                options={this.getCurrencies()}
              />

          </form>

          </ModalBody>
          <ModalFooter>
            {!this.state.validate
              ? <p style={{color: 'red'}}>ошибка валидации</p>
              : ''
            }
            <Button onClick={this.props.handleHide}>Close</Button>
            <Button onClick={this.onSubmit} type="submit" bsstyle="primary">Создать клиента</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default NewClient;
