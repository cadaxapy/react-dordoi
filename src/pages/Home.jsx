import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardImage, CardTitle, CardText } from 'mdbreact';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className='h-50 w-50 container'>
        <h2 className='text-center'>Заказы</h2>
        <Card>
            <CardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20%282%29.jpg" />
            <CardBody>
                <CardTitle>Card title</CardTitle>
                <CardText>Some quick example text to build on the card title and make up the bulk of the cards content.</CardText>
                <Button href="#">Button</Button>
            </CardBody>
        </Card>
      </div>
    );
  }
}

export default Home;
