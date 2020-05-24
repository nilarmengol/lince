import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useHistory } from "react-router-dom";

function Transition() {

    const history = useHistory();

    function handlePlayClick() {
      history.push("/game");
    }

    return (
        
    <Container className="p-3" >
    <Jumbotron className="text-center">
      <h2>Gran Lince!</h2>
    </Jumbotron>
    <Container className="text-center">
      <Row>
        <Col className="p-0">
          <Card fluid="true">
            <Card.Header className="text-left"><h5>Google Ad here</h5></Card.Header>
            <Card.Body>
                <Card.Title>Google ad here</Card.Title>
                
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
               
              </Card.Body>    
            
          </Card>
        </Col>
        
      </Row>
     
    </Container>
    
    
  </Container>


    );
  }

export default Transition;