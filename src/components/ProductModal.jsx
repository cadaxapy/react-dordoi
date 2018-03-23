import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Table, FormControl, ControlLabel } from 'react-bootstrap';
import './ProductModal.css';
import { Popover, PopoverBody, PopoverHeader, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormInline, Input} from 'mdbreact';
function NewProductPopover({productAmount, onSubmit, onChange, showProductForm, handleHide, saveProduct}) {
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
      productAmount: 0
    };
  };
  showProductForm() {
    this.setState({
      showProductForm: !this.state.showProductForm
    })
  };
  getProducts() {
    console.log(this.props.order.data().status);
    const products = this.props.products;
    var productRows = [];
    for(let i in products) {
      var data = products[i];
      productRows.push(
        <tr key={i}>
          <td>{data.name}</td>
          <td>{data.amount}</td>
          <td>{data.price}</td>
          <td>{data.sum}</td>
          {
            this.props.order.data().status == 0
            ? <td><a href="#" className='btn btn-warning .btn-xs' onClick={() => {
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
    this.showProductForm();
    db().collection('orders').doc(this.props.order.id)
    .collection('products').add({
      name: this.state.productName,
      quantity: parseInt(this.state.productQuantity),
      price: parseInt(this.state.productPrice),
      amount: parseInt(this.state.productAmount)
    });
  }
  onProductValueChange(e) {
    if(e.target.name == 'productQuantity') {
      this.setState({
        productAmount: e.target.value * this.state.productPrice
      })
    }
    if(e.target.name == 'productPrice') {
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
    const products = this.props.getProducts;
    return (
      <div className='container'>
        <NewProductPopover
          productAmount={this.state.productAmount}
          onSubmit={this.onProductValueSave}
          onChange={this.onProductValueChange}
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
                    this.props.order.data().status == 0
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
            this.props.order.data().status == 0 ?
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
