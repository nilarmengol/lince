// import React from "react";

// import Game from "./screens/Game";

// function App() {
//   return <Game />;
// }

// export default App;

import React, { useState, useEffect } from "react";
// google adsense
import AdSense from 'react-adsense';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/App.css";

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { useHistory } from "react-router-dom";

//import Background from './granlince.JPG'

//style={{backgroundImage: "url(" + Background + ")", backgroundRepeat: 'repeat'}}
import io from "socket.io-client";
//Deploy
//const ENDPOINT = window.location.hostname;
//Local

const ENDPOINT = "http://127.0.0.1:4001/";
const socket = io(ENDPOINT);

function App() {

  const history = useHistory();
  //States
  const [userName, setUsername] = useState("");
  const [validInput, setValidInput] = useState(false);
  const [nextPage, setNextPage] = useState("/lobby");
  const [validated, setValidated] = useState(false);

  // 
  const [urlPath, setUrlPath] = useState("");
  const [lobby, setLobby] = useState("");
  const [players, setPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState("");
 

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    if (form.checkValidity())
      history.push(nextPage, { userName: userName, id: 1});
  };


  useEffect(() => {
    //socket = io(ENDPOINT);
    socket.emit("helloMsg", { name: 'hello from home'});
    socket.on("lobbyEntered", function(data) {
    });

    // querystring
    let queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lobbyValue = urlParams.get("lobby");

    if (lobbyValue) {
      setLobby(lobbyValue);
    } 
    let url = window.location.href;
    if (url.indexOf("?") > -1) setUrlPath(window.location.href); 

    // create and add player
    socket.on("newGame", function(data) {
      let url = window.location.href;
      if (url.indexOf("?") > -1) {
        url += "&lobby=" + data.room;
      } else {
        url += "?lobby=" + data.room;
      }
      setUrlPath(url);
      setLobby(data.room);
      //setPlayerJoined(true);
    });
    socket.on("addPlayer", function(data) {
      let player = {};
      player.name = data.currentPlayer.name;
      player.id = data.currentPlayer.id;
      player.score = 0;
      const a =  [...players, player]
      setPlayers([...players, player]);
      setAllPlayers(data.allPlayers);
    })
    if(userName){
      history.push(nextPage, { userName: userName, id: 1, players: players, allPlayers: allPlayers, urlPath:urlPath});
    }
  }, [players]);

  const createRoom = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity())
    {
      if(!lobby){
        // create game
        socket.emit("createGame", { name: userName });
      }else{
        // join game
        let queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let lobbyParam = urlParams.get("lobby");
        socket.emit("joinGame", { room: lobbyParam, name: userName });
      }
    } 
  };

  // function handlePlayClick() {
  //   //history.push("/transition");
  // }

  // function handlePrivateRoomClick() {
  //   if(!userName) {
  //     console.log(userName);
  //     return false;
  //   }    
  // }

  return (
    
    <Container className="p-3" >
      <Jumbotron className="text-center">
        <h1>Gran Lince!</h1>
        <p>
          This is a simple game.
        </p>
        <p>
          <Button variant="primary">Learn more</Button>
        </p>
      </Jumbotron>
      <Container className="text-center">
        <Row>
          <Col className="p-0 pr-1">
          <Form noValidate validated={validated} onSubmit={createRoom}>
            <Card fluid="true">
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Header className="text-left">Start Game</Card.Header>
                  <ListGroup className="list-group-flush">
                  <ListGroupItem>
                  
                  
                    <Row>
                      <Col sm={8}>
                          <InputGroup>
                            <Form.Control
                              type="text"
                              placeholder="Enter your name"
                              aria-describedby="inputGroupPrepend"
                              required
                              onChange={event => setUsername(event.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter your name.
                            </Form.Control.Feedback>
                          </InputGroup>
                      </Col>
                      <Col sm={4}>
                        <Form>
                          <Form.Group>
                            <Form.Control as="select">
                              <option>English</option>
                            </Form.Control>
                          </Form.Group>
                        </Form>
                      </Col>
                    </Row>
                  

                  </ListGroupItem>
                  {lobby ? (
                    <>
                      <ListGroupItem>
                      <Button variant="info" block  type="submit" onClick={() => setNextPage('/lobby')}>
                        Join Room
                      </Button>
                      </ListGroupItem>
                    </>
                  ) : (
                    <>
                      <ListGroupItem>
                      <Button variant="success" size="lg" block  type="submit" onClick={() => setNextPage('/transition')}>
                        Play!
                      </Button>
                      </ListGroupItem>
                      <ListGroupItem>
                      <Button variant="info" block  type="submit" onClick={() => setNextPage('/lobby')}>
                        Create Private Room
                      </Button>
                      </ListGroupItem>
                    </>
                  )}
                  
                </ListGroup>
              <Card.Body>
                {/* <Card.Title>Google ad here</Card.Title>
                
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text> */}
                <AdSense.Google
                  client='ca-pub-4780603485802173'
                  slot='2930227358'
                  style={{ display: 'block' }}
                  format='auto'
                  data-adtest="on"
                  responsive='true'
                  layoutKey='-gw-1+2a-9x+5c'
                />    
              </Card.Body>
            </Card>
            </Form>
          </Col>
          <Col className="p-0 pl-1">
            <Card fluid="true">
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Header className="text-left">Featured</Card.Header>
              <Card.Body>
                <Card.Title>Google ad here</Card.Title>
                
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of
                  the card's content.
                </Card.Text>
              </Card.Body>
              <Accordion defaultActiveKey="0">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      News!
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>Hello! I'm the body</Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                      About!
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                      How to Play!
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="2">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Card>
          </Col>
        </Row>
       
      </Container>
      
      
    </Container>
 
  );
}

export default App;

