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
    this.state = {
      validate: true,
      loading: true,
      name: null,
      address: null,
      phone: null
    };
  };
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  };
  onSubmit(e) {
    e.preventDefault();
    if(!this.state.address || !this.state.name || !this.state.phone) {
      return this.setState({
        validate: false
      })
    }
    this.props.handleHide();
    this.props.showAlert();
    db().collection('carriers').add({
      name: this.state.name,
      address: this.state.address,
      phone: this.state.phone,
      createdAt: db.FieldValue.serverTimestamp()
    });
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.showModal}
          toggle={this.props.handleHide}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.props.handleHide}>Перевозчик</ModalHeader>
          <ModalBody>

            <form>
              <p className="h3 text-center mb-4">Добавить перевозчика</p>
              <Input label="Название" onChange={this.onChange} name="name" group type="text" validate error="wrong" success="right"/>
              <Input label="Адрес" onChange={this.onChange} name="address" group type="text" validate error="wrong" success="right"/>
              <Input label="Телефон" onChange={this.onChange} name="phone" group type="text" validate error="wrong" success="right"/>
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

export default NewTransfer;
