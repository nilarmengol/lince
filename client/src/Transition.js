// import React from 'react';
import React, { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useHistory } from "react-router-dom";

import io from "socket.io-client";


function Transition(props) {
  const ENDPOINT = "http://127.0.0.1:4001/";
  // let socket;
  const socket = io(ENDPOINT);
  const [countdown, setCountdown] = useState("5");
  const [redirect, setRedirect] = useState(false);
  const [userName, setUsername] = useState("");

  // 
  const [urlPath, setUrlPath] = useState("");
  const [players, setPlayers] = useState([]);
  const [lobby, setLobby] = useState("");
  const [redirection, setRedirection] = useState(false);
  const [flag, setFlag] = useState("");




    const history = useHistory();

    function handlePlayClick() {
      socket.emit("availableRoom", { name: userName });
      //socket.emit("createGame", { name: userName });
      //history.push("/game", {userName: userName});

      let url = window.location.href;
      socket.on("newGame", function(data) {
        console.log("newGame", data)
        let url = props.location.state.url;
        if (url.indexOf("?") > -1) {
          url += "&lobby=" + data.room;
        } else {
          url += "?lobby=" + data.room;
        }
        // setUrlPath(url);
        // setLobby(data.room);
        localStorage.removeItem('inviteUrl');
        localStorage.setItem('inviteUrl', url);
        setUrlPath(url);
        setLobby(data.room);
        //setPlayerJoined(true);
        localStorage.removeItem('userInfo');
      });
      socket.on("addPlayer", function(data) {
        console.log("addPlayer", data)
        let player = {};
        player.name = data.currentPlayer.name;
        player.id = data.currentPlayer.id;
        player.score = 0;
        // 
        setRedirection(true);
        // localstorage
        if(localStorage.getItem('userInfo') == null){
          //localStorage.setItem('userInfo', data.currentPlayer);
          localStorage.setItem('userInfo', JSON.stringify(data.currentPlayer));
        }
        
      });

      // 
      socket.on("roomAvail", function(data){
        console.log("roomAvail", data)
        console.log("roomAvail roomId", data.roomId)
        if(data.roomId && data.roomId != undefined){
          console.log("if block")
          setLobby(data.roomId);
          socket.emit("joinGame", { room: data.roomId, name: data.userName });
        }else{
          console.log("else block")
          setLobby(data.roomId);
          socket.emit("createGame", { name: data.userName, public: 1});
        }
      });

    }
    useEffect(() => {
        if(props.location.state.userName){  
          setUsername(props.location.state.userName);
        }

      if(redirection == true ){
        history.push("/game-public?lobby="+lobby, {userName: userName, totalRounds: "10", players: players, difficulty:"2"});
        //history.push("/test?lobby="+lobby, {userName: userName, totalRounds: "10", players: players, difficulty:"2"});
      }
    }, [redirection]);

    useEffect(() => {
          if(countdown >= 0){
            if(countdown == 0){setRedirect(true)}
            setTimeout(() => setCountdown(countdown - 1), 1000);
          }
      }, [countdown]);


      useEffect(() => {
        if(lobby){
          localStorage.setItem('lobby', lobby);
        }
        if(lobby){
          if(flag){
            socket.emit("getLobbyValues", {room: lobby})
          }else{
            socket.emit("LobbyValues", {room: lobby, difficulty:3, rounds:20})
          }
        }
    }, [lobby]);

      

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
                  <div className="pt-2">
                    <Button  
                      variant="success"
                      onClick={handlePlayClick}
                      disabled={!redirect}
                      >
                      {redirect ? ("Skip") : (`Skip in ${countdown} sec`)}          
                    </Button>
                  </div>
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