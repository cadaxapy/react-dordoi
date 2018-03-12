import React, { Component } from 'react';
import { Grid, Col, Image } from 'react-bootstrap';
import './About.css';

class About extends Component {
  render() {
    return (
      <div>
        <Image src='assets/hqdefault.jpg' className='header-image' />
        <Grid>
          <Col xs={12} sm={8} smOffset={2}>
            <Image src='assets/hqdefault.jpg' className='about-profile-pic' rounded />
            <h3>Test</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
            <p>labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</p>
            <p>laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit</p>
            <p>in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </Col>
        </Grid>
      </div>
    );
  }
}

export default About;
