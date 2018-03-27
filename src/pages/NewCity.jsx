import React, { Component } from 'react';
import { db } from '../firebase.js';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'mdbreact';
class NewCity extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      validate: true,
      loading: true,
      name: null,
      id: null
    };
  };
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  };
  onSubmit(e) {
    e.preventDefault();
    if(!this.state.name || !this.state.id) {
      return this.setState({
        validate: false
      })
    }
    this.props.handleHide();
    this.props.showAlert();
    db().collection('cities').add({
      name: this.state.name,
      id: this.state.id
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
          <ModalHeader toggle={this.props.handleHide}>Город</ModalHeader>
          <ModalBody>

            <form>
              <p className="h3 text-center mb-4">Добавить</p>
              <Input label="Название" onChange={this.onChange} name="name" group type="text" validate error="wrong" success="right"/>
              <Input label="id" onChange={this.onChange} name="id" group type="text" validate error="wrong" success="right"/>
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

export default NewCity;
