import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, HelpBlock, FormControl, Button, FormGroup, Radio, Checkbox, ControlLabel } from 'react-bootstrap';
import './NewOrder.css';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

class NewOrder extends Component {
  render() {
    return (
      <Form>
        <FieldGroup
          id="formControlsText"
          type="text"
          label="Клиент"
          placeholder="Enter text"
        />
        <FieldGroup
          id="formControlsEmail"
          type="text"
          label="Сотрудник"
          placeholder="Enter email"
        />
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Select</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="select">select</option>
            <option value="other">...</option>
          </FormControl>
        </FormGroup>
        <Button bsStyle='primary' type="submit">Создать заказ</Button>
      </Form>
    );
  }
}

export default NewOrder;
