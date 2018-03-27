import React, { Component } from 'react';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import Select from 'react-select';
import { Table } from 'react-bootstrap';
import OrderStatus from '../components/OrderStatus.jsx';
import ProductsModal from '../components/ProductModal.jsx';
import 'react-select/dist/react-select.css';
import { Button, Modal, ModalBody, ModalHeader, Input } from 'mdbreact';
import './NewOrder.css';
function UsersModal({handleHide, users, showModal}) {
  var userData = [];
  users.forEach(user => {
    const data = user.data();
    userData.push(
      <tr>
        <td>{data.name}</td>
        <td>{data.lastName}</td>
        <td>{data.phone}</td>
        <td>{data.role}</td>
      </tr>
    );
  })
  return (
    <Modal
      isOpen={showModal}
      toggle={handleHide}
      backdrop={"static"}
    >
      <ModalHeader toggle={handleHide}>Сотрудники</ModalHeader>
      <ModalBody>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {userData}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
}
class NewOrder extends Component {
  constructor() {
    super();
    this.updateOrder = this.updateOrder.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.onOrderChange = this.onOrderChange.bind(this);
    this.onCarrierSelect = this.onCarrierSelect.bind(this);
    this.getOrderPriceSum = this.getOrderPriceSum.bind(this);
    this.getInputCarrier = this.getInputCarrier.bind(this);
    this.handleUsersHide = this.handleUsersHide.bind(this);
    this.state = {
      loading: true,
      users: [],
      showProduct: false,
      products: null,
      validate: true,
      commission: 0,
      carrierCommission: 0,
      sumOfProducts: 0,
      client: null,
      order: null,
      carriers: null,
      selectedCarrier: {
        id: null,
        name: null
      }
    }
  }
  handleHide() {
    this.setState({ showProduct: false });
  }
  handleUsersHide() {
    this.setState({
      showUsers: false
    })
  }
  getProducts() {
    var products = this.state.products;
    var productRows = [];
    products.forEach(product => {
      var data = product.data();
      var productRef = db().collection('orders').doc(this.state.order.id)
      .collection('products').doc(product.id);
      productRows.push(
        <tr key={product.id}>
          <td>{data.name}</td>
          <td>{data.amount}</td>
          <td>{data.price}</td>
          <td>{data.amount}</td>
          {
            this.state.order.data().status === 0 ?
            <td><a className='btn btn-warning .btn-xs' onClick={() => {
              productRef.delete();
            }}>Удалить</a></td> : ''
          }
        </tr>
      );
    })
    return productRows;
  }
  getOrderPriceSum() {
    return parseInt(this.state.commission, 10) + parseInt(this.state.carrierCommission, 10) + this.state.sumOfProducts;
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    const orderDoc = db().collection('orders').doc(params.orderId);
    orderDoc.onSnapshot(order => {
      if(!order.exists) {
        return this.setState({
          loading: false,
          order: order
        });
      }
      var data = order.data();
      const usersRef = [];
      var userIds = Object.keys(order.data().users);
      for(let i in userIds) {
        usersRef.push(db().collection('users').doc(userIds[i]).get());
      }
      Promise.all([
        db().collection('clients').doc(data.client.id).get(),
        Promise.all(usersRef),
        db().collection('carriers').get()
      ]).then(([client, users, carriers]) => {
        this.setState({
          client: client,
          users: users,
          carriers: carriers,
          order: order,
          loading: false
        });
      });
    });
    orderDoc.collection('products')
    .onSnapshot(products => {
      var sumOfProducts = 0;
      products.forEach(product => {
        sumOfProducts += product.data().amount;
      });
      this.setState({
        sumOfProducts: sumOfProducts,
        products: products
      });
    });
  };
  getCarriers() {
    var carriers = this.state.carriers;
    var carrierOptions = [];
    carriers.forEach(carrier => {
      carrierOptions.push({value: carrier.id, label: carrier.data().name});
    });
    return carrierOptions;
  }
  onCarrierSelect(e) {
    this.setState({
      selectedCarrier: {
        id: e.value,
        name: e.label
      }
    });
  }
  onOrderChange(e) {
    var value = e.target.value
    if(value === '') {
      value = 0;
    }
    this.setState({
      [e.target.name]: value
    })
  }
  getInputCarrier() {
    if(this.state.order.data().status === 0) {
      return (
        <Select name="client" placeholder="Выберите перевозчика" value={this.state.selectedCarrier.id}  onChange={this.onCarrierSelect} options={this.getCarriers()}  searchable={true} />
      );
    }
    return;
  }
  updateOrder(e) {
    e.preventDefault();
    const commission = parseInt(this.state.commission, 10);
    const carrierCommission = parseInt(this.state.carrierCommission, 10);
    if(commission <= 0 || carrierCommission <= 0 || !this.state.selectedCarrier.id) {
      return this.setState({
        validate: false
      });
    }
    var orderPriceSum = this.getOrderPriceSum();
    db().collection('orders').doc(this.state.order.id).update({
      status: 1,
      commission: parseInt(this.state.commission, 10),
      carrier: this.state.selectedCarrier,
      carrierCommission: parseInt(this.state.carrierCommission, 10),
      orderPriceSum: orderPriceSum,
      createdAt: db.FieldValue.serverTimestamp()
    }).then(() => {
      var clientRef = db().collection('clients').doc(this.state.client.id);
      db().runTransaction(transaction => {
        return transaction.get(clientRef)
        .then(clientDoc => {
          var newBudget = clientDoc.data().budget - orderPriceSum;
          return transaction.update(clientRef, {budget: newBudget});
        });
      });
    });
  }
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    if(!this.state.order.exists) {
      return (
        <h1>Not found</h1>
      )
    }
    var order = this.state.order;
    var clientData = this.state.client.data();
    return (
      <div>
        <UsersModal users={this.state.users} showModal={this.state.showUsers} handleHide={this.handleUsersHide} />
        <ProductsModal order={order} getProducts={this.getProducts} showModal={this.state.showProduct} handleHide={this.handleHide} />
        <div className='border rounded z-depth-3 h-50 w-50 container'>
          <h1 className='text-center'>{"Заказ №" + order.id}</h1>
          <Table striped bordered condensed hover>
            <tbody>
              <tr>
                <td>Статус</td>
                <td><OrderStatus status={order.data().status}/></td>
              </tr>
              <tr>
                <td>Клиент</td>
                <td>{clientData.name + ', ' + clientData.city.name}</td>
              </tr>
              <tr>
                <td>Бюджет клиента</td>
                <td>{clientData.budget - this.getOrderPriceSum()}</td>
              </tr>
              <tr>
                <td>Сотрудники</td>
                <td><Button onClick={(e) => {this.setState({showUsers: true})}} color='primary'>Показать</Button></td>
              </tr>
              <tr>
                <td>Комиссия</td>
                <td>
                  {order.data().status === 0
                    ? <Input type="number" inputmode="numeric" onChange={this.onOrderChange} name="commission" group validate error="wrong" success="right"/>
                    : order.data().commission
                  }
                </td>
              </tr>
              <tr>
                <td>Перевозчики</td>
                <td>
                  {this.getInputCarrier()}
                </td>
              </tr>
              {this.state.selectedCarrier.id != null ?
                <tr>
                  <td>Комиссия за перевод</td>
                  <td>
                    <Input onChange={this.onOrderChange} name="carrierCommission" group type="number" validate error="wrong" success="right"/>
                  </td>
                </tr> : ''
              }

              <tr>
                <td>Общая сумма</td>
                <td>
                  {
                    order.data().status === 0
                    ?<input disabled onChange={this.onOrderChange} type="number" value={this.getOrderPriceSum()} className="form-control form-control-sm"/>
                    :order.data().orderPriceSum
                  }
                </td>
              </tr>
              <tr>
                <td>Товары</td>
                <td>
                  <Button onClick={(e) => {this.setState({showProduct: true})}} color='primary'>Показать</Button>
                </td>
              </tr>
            </tbody>
          </Table>
          {!this.state.validate
            ? <p style={{color: 'red'}}>ошибка валидации</p>
            : ''
          }
          {
            order.data().status === 0
            ? <Button onClick={this.updateOrder} bsstyle="primary">Создать Заказ</Button>
            : ''
          }

        </div>
      </div>
    );
  }
}

export default NewOrder;
