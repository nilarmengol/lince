import React, { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './lobby_chat.css';

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

    // 
    const [rounds, setRounds] = useState("10");
    const [difficulty, setDifficulty] = useState("3");
    const [difficulty_err, setDifficulty_err] = useState("");
    // 
    const [flag, setFlag] = useState("");

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
        player.name = data.currentPlayer.name;
        player.id = data.currentPlayer.id;
        player.score = 0;
        //setPlayers([...players, player]);
        setPlayers(data.allPlayers);
        setAdminName(data.allPlayers[0].name)
        if(data.currentPlayer.id == data.allPlayers[0].id){
          setButtonDisabled(false)
        }

        // localstorage
        if(localStorage.getItem('userInfo') == null){
          localStorage.setItem('userInfo', data.currentPlayer);
        }
        

      });
  
      socket.on("removePlayer", function(data) {
        let filteredArray = players.filter(item => item.id !== data.id);
        setPlayers(filteredArray);
      });

      socket.on("startGameRes", function(data) {
        setRedirection(true);
      });

      socket.on("onGetLobbyValues", function(data){
        console.log("ontest2", data);
        if(data != null){
          setRounds(data.rounds);
          setDifficulty(data.difficulty)
        }
      });

      if(redirection ){
          history.push("/game?lobby="+lobby, {userName: userName, totalRounds: rounds, players: players, difficulty:difficulty});
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
            // 
            socket.emit("getPlayers", { room: lobbyParam});
            socket.on("onGetPlayers", function(data) {
            setPlayers(data.players);
              //console.log("test players", data.players);

            });
            //console.log("joined players", players);
            // 
            socket.emit("joinGame", { room: lobbyParam, name: props.location.state.userName });
            setUrlPath(props.location.state.url);
            setPlayerJoined(true);
            setFlag(true);
        }
        
        socket.on("setLobbyValues", function(data){
          console.log("setLobbyValues", data)
          setRounds(data.rounds);
          setDifficulty(data.difficulty)
        });
    }, []);

    const buttonClick = (e) => {
      setDifficulty(e.target.value);
    };

    useEffect(() => {
      console.log("difficulty", difficulty)
      console.log("rounds", rounds)
      if(flag)
      {
        socket.emit("getLobbyValues", {room: lobby})
      }else{
        socket.emit("LobbyValues", {room: lobby, difficulty:difficulty, rounds:rounds})
      }
      // socket.on("setLobbyValues", function(data){
      //   console.log("setLobbyValues", data)
      //   setRounds(data.rounds);
      //   setDifficulty(data.difficulty)
      // });
    }, [difficulty, rounds, flag]);

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
                            <Form.Control as="select" onChange={event => setRounds(event.target.value)} disabled={buttonDisabled}>
                                <option selected={rounds == 10}>10</option>
                                <option selected={rounds == 20}>20</option>
                                <option selected={rounds == 30}>30</option>
                                <option selected={rounds == 40}>40</option>
                                <option selected={rounds == 50}>50</option>
                                <option selected={rounds == 60}>60</option>
                                <option selected={rounds == 70}>70</option>
                                <option selected={rounds == 80}>80</option>
                                <option selected={rounds == 90}>90</option>
                                <option selected={rounds == 100}>100</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </ListGroupItem>
                <ListGroupItem className="text-left">
                    <b> Difficulty </b>
                    <ListGroup horizontal>
                        <ListGroup.Item><Button variant={difficulty == 1 ? "success" : "outline-success" } value="1" onClick={buttonClick} disabled={buttonDisabled}>Easy</Button></ListGroup.Item>
                        <ListGroup.Item><Button variant={difficulty == 2 ? "warning" : "outline-warning" } value="2" onClick={buttonClick} disabled={buttonDisabled}>Medium</Button></ListGroup.Item>
                        <ListGroup.Item><Button variant={difficulty == 3 ? "danger" : "outline-danger" } value="3" onClick={buttonClick} disabled={buttonDisabled}>Hard</Button></ListGroup.Item>
                        {/* <ListGroup.Item><Button variant={difficulty == 3 ? "danger" : "outline-danger" } onClick={event => setDifficulty("3")}>Hard</Button></ListGroup.Item> */}
                    </ListGroup>
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