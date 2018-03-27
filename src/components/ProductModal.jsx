import React, { Component } from 'react';
import { db } from '../firebase.js';
import 'react-select/dist/react-select.css';
import { Table } from 'react-bootstrap';
import './ProductModal.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input} from 'mdbreact';
function NewProductPopover({validate, productAmount, onSubmit, onChange, showProductForm, handleHide, saveProduct}) {
  return (
    <Modal
      isOpen={showProductForm}
      toggle={handleHide}
      backdrop={"static"}
    >
    <ModalHeader toggle={handleHide}>Добавить товар</ModalHeader>
    <ModalBody>
      <form>
        <div className="row">
            <div className="col">
                <div className="md-form mt-0">
                   <Input onChange={onChange} label="Название" name="productName" group type="text" validate error="wrong" success="right"/>
                </div>
            </div>
            <div className="col">
                <div className="md-form mt-0">
                   <Input onChange={onChange} label="Количество" name="productQuantity" group type="number" validate error="wrong" success="right"/>
                </div>
            </div>
            <div className="col">
                <div className="md-form mt-0">
                   <Input onChange={onChange} label="Цена" name="productPrice" group type="number" validate error="wrong" success="right"/>
                </div>
            </div>
            <div className="col">
                <div className="md-form mt-0">
                  <div className="md-form form-group">
                  <input disabled value={productAmount} type="number" name="productPrice" className="form-control validate" />
                  <label className="active" data-error="wrong" data-success="right">Сумма</label>
                  </div>
                </div>
            </div>
        </div>
        <Button onClick={onSubmit} type="submit" bsstyle="primary">Добавить</Button>
        {!validate
          ? <p style={{color: 'red'}}>ошибка валидации</p>
          : ''
        }
      </form>
    </ModalBody>
  </Modal>
  );
}
class ProductModal extends Component {
  constructor() {
    super();
    this.showProductForm = this.showProductForm.bind(this);
    this.onProductValueChange = this.onProductValueChange.bind(this);
    this.onProductValueSave = this.onProductValueSave.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.onProductValueChange = this.onProductValueChange.bind(this);
    this.state = {
      showProductForm: false,
      productName: null,
      productQuantity: null,
      productPrice: null,
      validate: true,
      productAmount: 0
    };
  };
  showProductForm() {
    this.setState({
      showProductForm: !this.state.showProductForm
    })
  };
  getProducts() {
    const products = this.props.products;
    var productRows = [];
    for(let i in products) {
      var data = products[i];
      productRows.push(
        <tr key={i}>
          <td>{data.name}</td>
          <td>{data.quantity}</td>
          <td>{data.price}</td>
          <td>{data.amount}</td>
          {
            this.props.order.data().status === 0
            ? <td><a className='btn btn-warning .btn-xs' onClick={() => {
              this.props.deleteProduct(i);
            }}>Удалить</a></td> : ''
          }
        </tr>
      );
    }
    return productRows;
  }
  onProductValueSave(e) {
    e.preventDefault();
    const quantity = parseInt(this.state.productQuantity, 10);
    const price = parseInt(this.state.productPrice, 10);
    const amount = parseInt(this.state.productAmount, 10);
    if(!this.state.productName || quantity <= 0 || price <= 0) {
      return this.setState({
        validate: false
      })
    }
    this.showProductForm();
    db().collection('orders').doc(this.props.order.id)
    .collection('products').add({
      name: this.state.productName,
      quantity: quantity,
      price: price,
      amount: amount
    });
  }
  onProductValueChange(e) {
    if(e.target.name === 'productQuantity') {
      this.setState({
        productAmount: e.target.value * this.state.productPrice
      })
    }
    if(e.target.name === 'productPrice') {
      this.setState({
        productAmount: e.target.value * this.state.productQuantity
      })
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  render() {
    const showModal = this.props.showModal;
    const handleHide = this.props.handleHide;
    return (
      <div className='container'>
        <NewProductPopover
          productAmount={this.state.productAmount}
          onSubmit={this.onProductValueSave}
          onChange={this.onProductValueChange}
          validate={this.state.validate}
          showProductForm={this.state.showProductForm}
          handleHide={this.showProductForm} />
        <Modal
          size='lg'
          isOpen={showModal}
          toggle={handleHide}
          backdrop={"static"}
        >
          <ModalHeader toggle={handleHide}>Товары</ModalHeader>
          <ModalBody>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Количество</th>
                  <th>Цена</th>
                  <th>Сумма</th>
                  {
                    this.props.order.data().status === 0
                    ? <th></th> : ''
                  }

                </tr>
              </thead>
              <tbody>
                {this.props.getProducts()}
              </tbody>
            </Table>
          </ModalBody>
          {
            this.props.order.data().status === 0 ?
            <ModalFooter>
              <Button onClick={(e) => {this.setState({showProductForm: true})}} bsstyle="primary">Добавить новый товар</Button>
            </ModalFooter> : ''
          }
        </Modal>
      </div>
    );
  }
}

export default ProductModal;
