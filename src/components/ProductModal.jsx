import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Table, FormControl, ControlLabel } from 'react-bootstrap';
import './ProductModal.css';
import { Popover, PopoverBody, PopoverHeader, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormInline, Input} from 'mdbreact';
function NewProductPopover({productPriceSum, onSubmit, onChange, showProductForm, handleHide, saveProduct}) {
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
                   <Input onChange={onChange} label="Количество" name="productAmount" group type="number" validate error="wrong" success="right"/>
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
                  <input disabled value={productPriceSum} type="number" name="productPrice" className="form-control validate" />
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
      productAmount: null,
      productPrice: null,
      productPriceSum: 0
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
          <td>{data.amount}</td>
          <td>{data.price}</td>
          <td>{data.sum}</td>
          <td><a href="#" className='btn btn-warning .btn-xs' onClick={() => {
            this.props.deleteProduct(i);
          }}>Удалить</a></td>
        </tr>
      );
    }
    return productRows;
  }
  onProductValueSave(e) {
    e.preventDefault();
    this.showProductForm();
    this.props.addProduct({
      name: this.state.productName,
      amount: this.state.productAmount,
      price: this.state.productPrice,
      sum: this.state.productPriceSum
    });
  }
  onProductValueChange(e) {
    if(e.target.name == 'productAmount') {
      this.setState({
        productPriceSum: e.target.value * this.state.productPrice
      })
    }
    if(e.target.name == 'productPrice') {
      this.setState({
        productPriceSum: e.target.value * this.state.productAmount
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
          productPriceSum={this.state.productPriceSum}
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.getProducts()}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button onClick={(e) => {this.setState({showProductForm: true})}} bsstyle="primary">Добавить новый товар</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ProductModal;
