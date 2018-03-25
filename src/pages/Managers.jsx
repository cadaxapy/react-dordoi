import React, { Component } from 'react';
import { db } from '../firebase.js';
import NewClient from './NewClient.jsx';
import Spinner from '../components/Spinner.jsx'
import {Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'mdbreact';
import { Alert, Table, PageHeader} from 'react-bootstrap';
function GetManagers({managers, getRoles, toggleRoleDropDown, roleDD}) {
  var managerList = [];
  managers.forEach(manager => {
    var data = manager.data();
    managerList.push(
      <tr key={manager.id}>
        <td>{data.name}</td>
        <td>{data.lastName}</td>
        <td>{data.phone}</td>
        <td><p className='h4'>{data.role.name}</p></td>
        <td>
        <Dropdown isOpen = { roleDD } toggle = { toggleRoleDropDown }>
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
  })
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
    this.state = {
      loading: true,
      showModal: false,
      users: null,
      roleDD: false,
      roles: null
    };
  };
  showAlert() {
    this.setState({
      alert: true
    })
  }
  toggleRoleDropDown() {
    this.setState({
      roleDD: !this.state.roleDD
    })
  }
  changeRole({role, managerId}) {
    db().collection('users').doc(managerId).update({
      role: {
        id: role.id,
        name: role.name
      }
    })
  }
  getRoles(managerId) {
    var roleList = [];
    this.state.roles.forEach(role => {
      var data = role.data();
      roleList.push(<DropdownItem onClick={e => {
        this.changeRole({role: {
          id: role.id,
          name: data.name
        }, managerId: managerId})
      }}>{data.name}</DropdownItem>);
    });
    return roleList;
  }
  handleHide() {
    this.setState({ showModal: false });
  }
  componentDidMount() {
    Promise.all([
      db().collection('users')
      .orderBy('createdAt', 'desc')
      .get(),
      db().collection('roles')
      .get()
    ]).then(([users, roles]) => {
      this.setState({
        loading: false,
        users: users,
        roles: roles
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
        <GetManagers getRoles={this.getRoles} toggleRoleDropDown={this.toggleRoleDropDown} roleDD={this.state.roleDD} managers={this.state.users} />
      </div>
    );
  }
}

export default Clients;
