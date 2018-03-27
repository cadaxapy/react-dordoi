import React, { Component } from 'react';
import { db } from '../firebase.js';
import Spinner from '../components/Spinner.jsx'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'mdbreact';
import {Table, PageHeader} from 'react-bootstrap';
function GetManagers({managers, getRoles, toggleRoleDropDown}) {
  var managerList = [];
  for(let i in managers) {
    var manager = managers[i];
    var data = manager.data();
    managerList.push(
      <tr key={manager.id}>
        <td>{data.name}</td>
        <td>{data.lastName}</td>
        <td>{data.phone}</td>
        <td><p className='h4'>{data.role}</p></td>
        <td>
          <Dropdown isOpen = { manager.toggleRoleDropDown } toggle = { e => {
            toggleRoleDropDown(i)
          }}>
            <DropdownToggle caret color="primary">
              Поменять роль
            </DropdownToggle>
            <DropdownMenu>
              {getRoles(manager.id)}
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>
    )
  };
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Номер телефона</th>
          <th>Роль</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        {managerList}
      </tbody>
    </Table>
  )
}
class Clients extends Component {
  constructor() {
    super();
    this.handleHide = this.handleHide.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.toggleRoleDropDown = this.toggleRoleDropDown.bind(this);
    this.roles = ['new', 'admin', 'worker', 'manager', 'blocked'];
    this.state = {
      loading: true,
      showModal: false,
      users: []
    };
  };
  showAlert() {
    this.setState({
      alert: true
    })
  }
  toggleRoleDropDown(i) {
    var users = this.state.users;
    users[i].toggleRoleDropDown = !users[i].toggleRoleDropDown;
    this.setState({
      users: users
    })
  }
  changeRole(e) {
    db().collection('users').doc(e.target.dataset.manager_id).update({
      role: e.target.dataset.value
    });
  }
  getRoles(managerId) {
    var roleList = [];
    const roles = this.roles;
    for(let i in roles) {
      var role = roles[i];
      roleList.push(<DropdownItem key={i} data-value={role} data-manager_id={managerId} onClick={this.changeRole}>{role}</DropdownItem>);
    }
    return roleList;
  }
  handleHide() {
    this.setState({ showModal: false });
  }
  componentDidMount() {
    db().collection('users')
    .onSnapshot(users => {
      const userList = users.docs.map(e => {
        e.toggleRoleDropDown = false;
        return e;
      });
      this.setState({
        loading: false,
        users: userList
      });
    });
  }
  render() {
    if(this.state.loading) {
      return (
        <Spinner />
      )
    }
    return (
      <div className='container-fluid'>
        <PageHeader>
          Менеджеры&nbsp;&nbsp;
        </PageHeader>
        <GetManagers getRoles={this.getRoles} toggleRoleDropDown={this.toggleRoleDropDown} managers={this.state.users} />
      </div>
    );
  }
}

export default Clients;
