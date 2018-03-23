import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
//import {NavDropdown, MenuItem, Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { Navbar, NavbarBrand, NavbarToggler, Fa, Collapse, NavbarNav, NavItem } from 'mdbreact';import './CustomNavbar.css';

class CustomNavbar extends Component {
  constructor() {
    super();
    this.state ={
      collapse: false,
      isWideEnough: false
    };
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }
  render() {
    if(window.location.pathname === '/auth') {
      return (
        <Navbar color="indigo" dark expand="md" fixed="top" scrolling>
          <NavbarBrand href='/'>Дордой</NavbarBrand>
        </Navbar>
      );
    }
    return (
      <Navbar color="indigo" dark expand="md" fixed="top" scrolling>
        <NavbarBrand href="/">Дордой</NavbarBrand>
        {!this.state.isWideEnough && <NavbarToggler onClick ={this.onClick} />}
        <Collapse isOpen={this.state.collapse} navbar>
          <NavbarNav className="mr-auto" onClick={this.onClick}>
            <NavItem>
              <NavLink className="nav-link" to="/order-new">Новый заказ</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/clients">Клиенты</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/pricing">Пользователи</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/transfers">Переводы</NavLink>
            </NavItem>
          </NavbarNav>
          <NavbarNav>
            <NavItem className="ml-auto">
              <NavLink className="nav-link" to='/logout'><Fa icon="sign-out" /></NavLink>
            </NavItem>
          </NavbarNav>
        </Collapse>
      </Navbar>
    );
    /*if(window.location.pathname === '/auth') {
      return (
        <Navbar default collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/'>Авторизация</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        </Navbar>
      );
    }
    return (
      <Navbar default collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'>Дордой</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav pullLeft>
        <NavItem eventKey={1} componentClass={Link}  href='/order/new' to='/order/new'>
          Новый заказ
        </NavItem>
        <NavItem eventKey={1} componentClass={Link}  href='/' to='/'>
          Пользователи
        </NavItem>
        <NavDropdown eventKey={3} title="Клиенты" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1} componentClass={Link}  href='/clients' to='/clients'>Список Клиентов</MenuItem>
          <MenuItem eventKey={3.2} componentClass={Link}  href='/client/new' to='/client/new'>Добавить Клиента</MenuItem>
        </NavDropdown>
        <NavItem eventKey={1} componentClass={Link}  href='/' to='/'>
          Клиенты
        </NavItem>
        <NavItem eventKey={1} componentClass={Link}  href='/' to='/'>
          Города
        </NavItem>
        <NavItem eventKey={1} componentClass={Link}  href='/' to='/'>
          Переводы
        </NavItem>
        <NavItem eventKey={1} componentClass={Link}  href='/' to='/'>
          Перевозчики
        </NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={3} componentClass={Link} href='/logout' to='/logout'>
            <Glyphicon glyph="log-out" />
          </NavItem>
        </Nav>
        </Navbar.Collapse>
      </Navbar>
    );*/
  }
}

export default CustomNavbar;
