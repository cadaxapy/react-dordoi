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
      name: null
    };
  };
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  };
  onSubmit(e) {
    e.preventDefault();
    if(!this.state.name) {
      return this.setState({
        validate: false
      })
    }
    this.props.handleHide();
    this.props.showAlert();
    db().collection('cities').add({
      name: this.state.name
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
              <p className="h4 text-center mb-4">Новый город</p>
              <Input size='sm' label="Название" onChange={this.onChange} name="name" group type="text" validate error="wrong" success="right"/>
          </form>
          </ModalBody>
          <ModalFooter>
            {!this.state.validate
              ? <p style={{color: 'red'}}>ошибка валидации</p>
              : ''
            }
            <Button onClick={this.props.handleHide}>Close</Button>
            <Button onClick={this.onSubmit} type="submit" bsstyle="primary">Добавить город</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default NewCity;
