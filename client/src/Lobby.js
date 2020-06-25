import React, { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Form from 'react-bootstrap/Form';
import { useHistory } from "react-router-dom";

import io from "socket.io-client";
//Deploy
//const ENDPOINT = window.location.hostname;
//Local


function Lobby(props) {
    //const ENDPOINT = "http://127.0.0.1:4001/lobby";
    const ENDPOINT = "http://127.0.0.1:4001/";
    // let socket;
    const socket = io(ENDPOINT);
    const [urlPath, setUrlPath] = useState("");
    const history = useHistory();
    const [copySuccess, setCopySuccess] = useState("");

    // 
    const [lobby, setLobby] = useState("");
    const [players, setPlayers] = useState([]);
    const [userName, setUsername] = useState("");



    function handlePlayClick() {
      history.push("/game");
    }

    const copyToClipboard = () => {
      navigator.clipboard.writeText(urlPath);
      setCopySuccess("Copied!");
    };

    useEffect(() => {
      // socket = io(ENDPOINT);
      socket.on("lobbyEntered", function(data) {
      });
      setPlayers(props.location.state.players);
      setUrlPath(props.location.state.urlPath);
      setUsername(props.location.state.userName);
      
    }, []);

    return (
    <Container className="p-3" >
    <Jumbotron className="text-center">
      <h2>Gran Lince!</h2>
    </Jumbotron>
    <Container className="text-center">
      <Row>
        <Col className="p-0 pr-1">
          <Card fluid="true">
              <Card.Header className="text-left"><h5>{userName}'s Private Lobby</h5></Card.Header>
                <ListGroup className="list-group-flush">
                <ListGroupItem>
                    <Form className="text-left">
                        <Form.Label><b>Rounds</b></Form.Label>
                        <Form.Group>
                            <Form.Control as="select">
                                <option>10</option>
                                <option>20</option>
                                <option>30</option>
                                <option>40</option>
                                <option>50</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </ListGroupItem>
                <ListGroupItem className="text-left">
                    <b> Difficulty </b>
                    <ListGroup horizontal>
                        <ListGroup.Item>Easy</ListGroup.Item>
                        <ListGroup.Item>Medium</ListGroup.Item>
                        <ListGroup.Item>Hard</ListGroup.Item>
                    </ListGroup>
                </ListGroupItem>
                <ListGroupItem>
                    <Form className="text-left">
                        <Form.Label><b>Language</b></Form.Label>
                        <Form.Group>
                            
                            <Form.Control as="select">
                            <option>English</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </ListGroupItem>
                <ListGroupItem>
                <Button variant="success" size="lg" block onClick={handlePlayClick}>
                  Start Game!
                </Button>
                </ListGroupItem>
                <ListGroupItem>
                {urlPath ? (
                    <span>
                      <input type="text" style={{width:'100%', marginBottom:10}} value={urlPath} readOnly />
                      <Button variant="secondary" size="lg" block onClick={copyToClipboard}>
                        Invite
                      </Button>
                      {copySuccess}
                    </span>
                  ) : (
                    <span></span>
                  )}
                </ListGroupItem>
                
              </ListGroup>
            
          </Card>
        </Col>
        <Col className="p-0 pl-1">
          <Card fluid="true">
              <Card.Header className="text-left"><h5>Players Joined</h5></Card.Header>
              <Card.Body>
                <ListGroup>
                    <ListGroupItem>
                        <Button variant="primary" size="sm" block>
                        Player1
                        </Button>
                        </ListGroupItem>
                        <ListGroupItem>
                        <Button variant="primary" size="sm" block>
                        Player2
                        </Button>
                        </ListGroupItem>
                    </ListGroup>
              </Card.Body>
          </Card>
        </Col>
      </Row>
     
    </Container>
    
    
  </Container>


    );
  }

export default Lobby;