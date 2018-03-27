import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact';
import './NewOrder.css';
class NewTransfer extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getCities = this.getCities.bind(this);
    this.getClients = this.getClients.bind(this);
    this.onClientSelect = this.onClientSelect.bind(this);
    this.onUserSelect = this.onUserSelect.bind(this);
    this.state = {
      redirect: false,
      error: false,
      clients: null,
      users: null,
      client: {
        id: null,
        name: null,
        cityName: null
      },
      user: {
        id: null,
        name: null
      },
      amount: 0,
      loading: true
    };
  };
  getUsers() {
    var users = this.state.users;
    var userOptions = [];
    users.forEach(user => {
      userOptions.push({value: user.id, label: user.data().phone});
    });
    return userOptions;
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
  onClientSelect(e) {
    var selectedClientCity = "";
    this.state.clients.forEach(client => {
      if(client.id === e.value) {
        selectedClientCity = client.data().city.name;
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
  getClients() {
    var clients = this.state.clients;
    var clientOptions = [];
    clients.forEach(client => {
      clientOptions.push({cityName: client.data().city.name, value: client.id, label: client.data().name});
    });
    return clientOptions;
  }
  onUserSelect(e) {
    this.setState({
      user: {
        id: e.value,
        name: e.label
      }
    })
  }
  onSubmit(e) {
    e.preventDefault();
    var amount = parseInt(this.state.amount, 10);
    if(!this.state.client.id || !this.state.user.id || !amount || amount <= 0) {
      return this.setState({
        error: true
      })
    }
    this.props.handleHide();
    this.props.showAlert();
    db().collection('transfers').add({
      client: this.state.client,
      user: this.state.user,
      amount: parseInt(this.state.amount, 10),
      createdAt: db.FieldValue.serverTimestamp()
    }).then(() => {
      var clientRef = db().collection('clients').doc(this.state.client.id);
      db().runTransaction(transaction => {
        return transaction.get(clientRef)
        .then(clientDoc => {
          var newBudget = clientDoc.data().budget + amount;
          return transaction.update(clientRef, {budget: newBudget});
        });
      }).catch(e => {
        console.log(e);
      });
    });
  }
  componentDidMount() {
    Promise.all([
      db().collection('users').get(),
      db().collection('clients').get()
    ]).then(([users, clients]) => {
      this.setState({
        clients: clients,
        users: users,
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
              <p className="h3 text-center mb-4">Добавить перевод</p>
              <h5>Клиент</h5>
              <Select
                name="client"
                placeholder="Выберите клиента"
                value={this.state.client.id}
                onChange={this.onClientSelect}
                options={this.getClients()}
                searchable={true}
              />
              <h5>Переводчик</h5>
              <Select
                name="user"
                placeholder="Выберите переводчика"
                value={this.state.user.id}
                onChange={this.onUserSelect}
                options={this.getUsers()}
                searchable={true}
              />
              <h5>Сумма</h5>
              <Input size='sm' onChange={this.onChange} name="amount" group type="number" validate error="wrong" success="right"/>
          </form>

          </ModalBody>
          <ModalFooter>
            {this.state.error
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

export default NewTransfer;
