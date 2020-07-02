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
import queryString from 'query-string';

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

    // 
    const [randomItem, setRandomItem] = useState("");
    const [success, setSuccess] = useState(false);
    const [userName, setUsername] = useState("");
    const [adminName, setAdminName] = useState("");
    const [lobby, setLobby] = useState("");
    const [playerJoined, setPlayerJoined] = useState("");
    const [winner, setWinner] = useState("");
    const [players, setPlayers] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [refreshButtonDisabled, setRefreshButtonDisabled] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const [redirection, setRedirection] = useState(false);



    function handlePlayClick() {
      //history.push("/game?lobby="+lobby, {userName: userName});
      socket.emit("startGame", { room: lobby,name: userName });
    }

    const copyToClipboard = () => {
      navigator.clipboard.writeText(urlPath);
      setCopySuccess("Copied!");
    };

  
    useEffect(() => {}, [success]);

  
    useEffect(() => {
      if(props.location.state.userName){
      setUsername(props.location.state.userName);
      }
      let queryString = window.location.search;
      queryString = queryString.concat(window.location.hash);
      const urlParams = new URLSearchParams(queryString);
      const lobbyValue = urlParams.get("lobby");
  
      if (lobbyValue) setLobby(lobbyValue);
  
      let url = window.location.href;
      //if (url.indexOf("?") > -1) setUrlPath(window.location.href);
      socket.on("newGame", function(data) {
        //let url = window.location.href;
        let url = props.location.state.url;
        if (url.indexOf("?") > -1) {
          url += "&lobby=" + data.room;
        } else {
          url += "?lobby=" + data.room;
        }
        setUrlPath(url);
        setLobby(data.room);
        setPlayerJoined(true);
      });
  
      socket.on("addPlayer", function(data) {
        let player = {};
        player.name = data.name;
        player.id = data.id;
        player.score = 0;
        //setPlayers([...players, player]);
        setPlayers(data.allPlayers);
        setAdminName(data.allPlayers[0].name)
        if(data.currentPlayer.name == data.allPlayers[0].name){

          setButtonDisabled(false)
        }
      });
  
      socket.on("removePlayer", function(data) {
        let filteredArray = players.filter(item => item.id !== data.id);
        setPlayers(filteredArray);
      });

      socket.on("startGameRes", function(data) {
        setRedirection(true)
      });
      if(redirection){
        history.push("/game?lobby="+lobby, {userName: userName});
      }

    }, [players, redirection]);

    useEffect(() => {
        if(props.location.state.action == "create"){  
        socket.emit("createGame", { name: props.location.state.userName });
        }
        if(props.location.state.action == "join"){
            let queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let lobbyParam = urlParams.get("lobby");
            socket.emit("joinGame", { room: lobbyParam, name: props.location.state.userName });
            setUrlPath(props.location.state.url);
            setPlayerJoined(true);
        }
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
              <Card.Header className="text-left"><h5>{adminName}'s Private Lobby</h5></Card.Header>
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
                <Button variant="success" size="lg" block onClick={handlePlayClick} disabled={buttonDisabled}>
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
                    {/* <ListGroupItem>
                        <Button variant="primary" size="sm" block>
                        Player1
                        </Button>
                      </ListGroupItem>
                      <ListGroupItem>
                        <Button variant="primary" size="sm" block>
                        Player2
                        </Button>
                      </ListGroupItem> */}
                      {players.map((person, index) => (
                          <ListGroupItem key={person.id}>
                          <Button variant="primary" size="sm" block>
                          {person.name}
                          </Button>
                        </ListGroupItem>
                      ))}
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