import React, { useState, useEffect } from "react";
import queryString_test from 'query-string'
import "../styles/game.css";
import { itemsIcons_all } from "../assets/Assets";
import StartIcon from "../icons/start-icon.png";
import io from "socket.io-client";

// 
import '../lobby_chat.css';
import * as Icon from 'react-bootstrap-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


//Deploy
//const ENDPOINT = window.location.hostname;
//Local
//const ENDPOINT = "http://127.0.0.1:4001/game";
const ENDPOINT = "http://127.0.0.1:4001/";
const socket = io(ENDPOINT);

//const itemsIcons = itemsIcons_all.slice(0, 200);
//let itemsIcons = itemsIcons_all.slice(0, 200);

function Game(props) {
  //const ENDPOINT = "http://127.0.0.1:4001/home";
  // socket = io(ENDPOINT);

  //const [items, setItems] = useState(itemsIcons);
  const [items, setItems] = useState("");
  const [randomItem, setRandomItem] = useState("");
  const [success, setSuccess] = useState(false);
  const [userName, setUsername] = useState("");
  const [lobby, setLobby] = useState("");
  const [playerJoined, setPlayerJoined] = useState(true);
  const [winner, setWinner] = useState("");
  const [players, setPlayers] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState("");
  const [refreshButtonDisabled, setRefreshButtonDisabled] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  // 
  const [totalRounds, setTotalRounds] = useState("10");
  const [rounds, setRounds] = useState(1);
  const [roundsLeft, setRoundsLeft] = useState("");
  const [gameWinner, setGameWinner] = useState("");
  //let itemsIcons = itemsIcons_all.slice(0, 200);

  // 
  const [msgs, setMsg] = useState("");
  const [allMsg, setAllMsg] = useState("");
  const [userMsg, setUserMsg] = useState("");

  // 
  const [countdown, setCountdown] = useState("3");



  useEffect(() => {}, [success]);

  useEffect(() => {
    if(msgs)
    {
    setAllMsg([...allMsg, msgs]);
    }
    
  }, [msgs]);

  useEffect(() => {
    if(winner)
    {
      if(winner.score > totalRounds/players.length){
        setGameWinner(winner);
      }else{
        setRoundsLeft(roundsLeft - 1);
        if(rounds<=totalRounds){setRounds(rounds + 1)};
      }  
    }
  }, [winner]);
  

  useEffect(() => {
    let queryString = window.location.search;
    queryString = queryString.concat(window.location.hash);
    const urlParams = new URLSearchParams(queryString);
    const lobbyValue = urlParams.get("lobby");
    // const totalRounds = props.location.state.rounds;
    if(props.location.state.totalRounds != undefined){
      setTotalRounds(props.location.state.totalRounds);
      setRoundsLeft(props.location.state.totalRounds);
    }

    const difficulty = props.location.state.difficulty;
    
    let itemsIcons = "";
    switch (difficulty) {
      case '1':
        itemsIcons = itemsIcons_all.slice(0, 200);
        setItems(itemsIcons_all.slice(0, 200));
        break;
      case '2':
        itemsIcons = itemsIcons_all.slice(0, 300);
        setItems(itemsIcons_all.slice(0, 300));
        break;
      case '3':
        itemsIcons = itemsIcons_all.slice(0, 500);
        setItems(itemsIcons_all.slice(0, 500));
        break;
      default:
        itemsIcons = itemsIcons_all.slice(0, 400);
        setItems(itemsIcons_all.slice(0, 400));
        break;
    }
    itemsIcons ? setItems(itemsIcons) : setItems("")

    socket.on("onGroupMsg", function(data) {
      let msg = {};
      msg.name = data.name;
      msg.message = data.message;
      setMsg(msg);
    });
  }, []);




  const [urlPath, setUrlPath] = useState("");

  useEffect(() => {
    setUsername(props.location.state.userName);
    console.log("game",props.location.state.userName)
    let queryString = window.location.search;
    queryString = queryString.concat(window.location.hash);
    const urlParams = new URLSearchParams(queryString);
    const lobbyValue = urlParams.get("lobby");

    if (lobbyValue) setLobby(lobbyValue);
    let url = window.location.href;
    //if (url.indexOf("?") > -1) setUrlPath(window.location.href);

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
      //setPlayers([...players, player]);
      setPlayers(data.allPlayers);
    });

    socket.on("onGetPlayers", function(data) {
      setPlayers(data.players);
    });

    socket.on("removePlayer", function(data) {
      let filteredArray = players.filter(item => item.id !== data.id);
      setPlayers(filteredArray);
    });
  }, [players]);

//}, [players, setPlayers, setLobby, setPlayerJoined, setUrlPath]);

  const newGame = () => {
    socket.emit("createGame", { name: userName });
  };

  const joinGame = () => {
    //const queryString = window.location.search;
    let queryString = window.location.search;
    queryString = queryString.concat(window.location.hash);
    const urlParams = new URLSearchParams(queryString);
    let lobbyParam = urlParams.get("lobby");
    socket.emit("joinGame", { room: lobbyParam, name: userName });
    //setPlayerJoined(true);

  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(urlPath);
    setCopySuccess("Copied!");
  };

  return (
    <div className="layout">
      <div className="boardgame">
        <Boardgame
          setSuccess={setSuccess}
          randomItem={randomItem}
          setPlayers={setPlayers}
          players={players}
          success={success}
          setButtonDisabled={setButtonDisabled}
          setRefreshButtonDisabled={setRefreshButtonDisabled}
          items={items}
          userName={userName}
          winner={winner}
          setWinner={setWinner}
          lobby={lobby}
          setRoundsLeft={setRoundsLeft}
          roundsLeft={roundsLeft}
          totalRounds={totalRounds}
          gameWinner={gameWinner}
          setCountdown={setCountdown}
        />
      </div>
      <div className="selections block">
        <Item
          setItems={setItems}
          randomItem={randomItem}
          setRandomItem={setRandomItem}
          buttonDisabled={buttonDisabled}
          setButtonDisabled={setButtonDisabled}
          refreshButtonDisabled={refreshButtonDisabled}
          setRefreshButtonDisabled={setRefreshButtonDisabled}
          setSuccess={setSuccess}
          success={success}
          items={items}
          lobby={lobby}
          setLobby={setLobby}
          winner={winner}
          setWinner={setWinner}
          totalRounds={totalRounds}
          roundsLeft={roundsLeft}
          rounds={rounds}
          itemsIcons={items}
          countdown={countdown}
          setCountdown={setCountdown}
        />
        <Players
          players={players}
          success={success}
          lobby={lobby}
          winner={winner}
          setPlayers={setPlayers}
          gameWinner={gameWinner}
          totalRounds={totalRounds}
          userMsg={userMsg}
          setUserMsg={setUserMsg}
          userName={userName}
          allMsg={allMsg}
          roundsLeft={roundsLeft}

        />
        <br />
        {urlPath ? (
          <span>
            <input type="text" value={urlPath} readOnly />
            <button className="refresh block" onClick={copyToClipboard}>
              Invite
            </button>
            {copySuccess}
          </span>
        ) : (
          <span></span>
        )}

        {playerJoined ? (
          <div></div>
        ) : (
          <div className="container">
            {lobby ? (
              <span>
                <h4>Join game</h4>
                <input
                  type="text"
                  name="name"
                  id="nameJoin"
                  placeholder="Enter your name"
                  required
                  onChange={event => setUsername(event.target.value)}
                />
                <button id="join" onClick={joinGame} className="button block">
                  Join Game
                </button>
              </span>
            ) : (
              <span>
                <h4>Create a new Game</h4>
                <input
                  type="text"
                  name="name"
                  id="nameNew"
                  placeholder="Enter your name"
                  required
                  onChange={event => setUsername(event.target.value)}
                />
                <button onClick={newGame} className="button block">
                  New Game
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Item(props) {
  const {
    randomItem,
    setRandomItem,
    buttonDisabled,
    setButtonDisabled,
    refreshButtonDisabled,
    setRefreshButtonDisabled,
    setSuccess,
    success,
    setItems,
    items,
    lobby,
    setWinner,
    winner,
    itemsIcons,
    countdown,
    totalRounds,
    roundsLeft,
    rounds,
    setCountdown
  } = props;

  useEffect(() => {
    socket.on("onRefresh", function(data) {
      let copyItems = [...items];
      let array = copyItems;
      let currentIndex = array.length;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        let temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      setItems(array);
      setRefreshButtonDisabled(true);
    });

    socket.on("onNewItem", function(data) {
      setWinner("");
      setSuccess(false);
      setButtonDisabled(true);
      setRefreshButtonDisabled(true);
      setRandomItem(itemsIcons[data.itemId]);
    });

    socket.on("onRefreshItem", function(data) {
      setWinner("");
      setSuccess(false);
      setButtonDisabled(false);
      setRefreshButtonDisabled(true);
      setRandomItem(itemsIcons[data.itemId]);
    });

  //if(success){ random();}

  }, [
    items,
    // setItems,
    // setRandomItem,
    // setSuccess,
    // setButtonDisabled,
    // setRefreshButtonDisabled,
    // setWinner
  ]);

  useEffect(() => {
    if(success){
      refresh_image();}
  }, [success]);

  useEffect(() => {
    countdown >= 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
    if(countdown == 0){
      refresh_image();
    }
  }, [countdown]);


  const random = () => {
    setSuccess(false);
    setButtonDisabled(true);
    setRefreshButtonDisabled(true);
    const itemId = Math.floor(Math.random() * itemsIcons.length);
    setRandomItem(itemsIcons[itemId]);
    socket.emit("newItem", { room: lobby, itemId: itemId });
  };

  const relocate = () => {
    socket.emit("refresh", { room: lobby });
  };

  const refresh_image = () => {
    setSuccess(false);
    setRefreshButtonDisabled(true);
    const itemId = Math.floor(Math.random() * itemsIcons.length);
    setRandomItem(itemsIcons[itemId]);
    socket.emit("refreshItem", { room: lobby, itemId: itemId });
  };

  // if(success){ refresh_image();}

  return (
    <div>

      <div className="text-center">
        <h5>{rounds}/{totalRounds} Rounds</h5>
      </div>
      {countdown < 0 ? (
        <img
        className={!success ? "bigIcon neutral" : "bigIcon correct"}
        src={randomItem ? randomItem : StartIcon}
        alt={randomItem}
      />
      ): (
      <div className="bigIcon neutral countdownDiv">
        {countdown == 0 ? "Start" : countdown}
      </div>)}
      {/* <img
        className={!success ? "bigIcon neutral" : "bigIcon correct"}
        src={randomItem ? randomItem : StartIcon}
        alt={randomItem}
      />
      <div className="bigIcon neutral">
      </div> */}
      <div>
        <button
          className={buttonDisabled ? "disabled block" : "button block"}
          onClick={random}
          disabled={buttonDisabled}
        >
          New Items
        </button>
        <button
          onClick={relocate}
          className={
            refreshButtonDisabled ? "refreshDisabled block" : "refresh block"
          }
          disabled={refreshButtonDisabled}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

function Players(props) {
  const { players, success, lobby, winner, setPlayers, gameWinner, roundsLeft, totalRounds, setUserMsg, userMsg, userName, allMsg } = props;

  useEffect(() => {
    socket.emit("getPlayers", { room: lobby});
    socket.on("onGetPlayers", function(data) {
      setPlayers(data.players);
    });
  }, [lobby]);


  const anotherGameBtn = () => {
    console.log("Another Game", players)
    socket.emit("anotherGame", { room: lobby, players: players, gameWinner: gameWinner });
  }  

  function handleChange(e) {
    setUserMsg(e.target.value);
  }

  function handleSubmit() {
    if(userMsg){
    socket.emit("groupMsg", { room: lobby,name: userName, message: userMsg});
    setUserMsg("");
    }
  }

  return (
    <>
    <div className="players">
      {roundsLeft != 0 && !gameWinner && success && <p>{winner.name} won the round</p>}
      {/* { gameWinner && <p>{gameWinner.name} won the game</p>} */}
      { gameWinner && <div className="pb-2"><p>{gameWinner.name} won the game</p>
        <Button
          variant="success"
          onClick={anotherGameBtn}
        >
          Another Game?
        </Button>
      </div>
      }
      {roundsLeft == 0 && winner.score == totalRounds/2 && <p>Match Draw</p>}
      {players.map((player, index) => (
        <div key={index} className="player">
          <p>{player.name}</p> <p className="score">Score: {player.score}</p>
        </div>
      ))}
    </div>

    {players.length > 0 && <Card fluid="true" className="mt-3">
    <Card.Header className="text-left"><h5>Chat</h5></Card.Header>
    <Card.Body>
      <div className="chatWindow">
        {allMsg != "" ? (
        <ul className="chat" id="chatList">
          {allMsg.map(data => (
            allMsg.length > 0 ? (
            <div>
              {userName === data.name ? (
                <li className="self">
                  <div className="msg">
                    <p>{data.name}</p>
                    <div className="message"> {data.message}</div>
                  </div>
                </li>
              ) : (
                <li className="other">
                  <div className="msg">
                    <p>{data.name}</p>
                  <div className="message"> {data.message}</div>
                  </div>
                </li>
              )}
            </div>) : <></>
          ))}
        </ul>) : <></> }
        <div className="chatInputWrapper">
          <form >
            <div className="message_input ">
              <input
                className="textarea input "
                type="text"
                placeholder="Enter your message..."
                value={userMsg}
                onChange={handleChange}
              />
              <span className="message_submit" >
                <Icon.CursorFill color="royalblue" size={50} onClick={handleSubmit} />
                {/* <Button variant="primary" size="sm" block onClick={handleSubmit}>Send</Button> */}
                </span>
            </div>
            {/* <Button variant="primary" size="sm" block onClick={handleSubmit}>Send</Button> */}
          </form>
        </div>
        </div>
    </Card.Body>
    </Card>}


   </>             


  );
}

function Boardgame(props) {
  const {
    setPlayers,
    players,
    setButtonDisabled,
    setRefreshButtonDisabled,
    randomItem,
    setSuccess,
    success,
    items,
    userName,
    lobby,
    winner,
    setWinner,
    setRoundsLeft, 
    roundsLeft,
    totalRounds,
    gameWinner,
    setCountdown
  } = props;

  useEffect(() => {
    socket.on("onUpdateBoard", function(data) {
      let playersCopy = [...players];
      playersCopy.forEach(function(item, i) {
        if (item.id === data.winner.id && !winner) {
          playersCopy[i].score = data.winner.score;
          setWinner(playersCopy[i]);
          setPlayers(playersCopy);
          setButtonDisabled(false);
          setRefreshButtonDisabled(false);
          setSuccess(true);
        }
      });
    });
  }, [players]);

//}, [players, setButtonDisabled, setRefreshButtonDisabled, setSuccess, setPlayers, setWinner, winner]);

  const endMatch = item => {
    setCountdown("3")
  }  

  const score = item => {
    if (item === randomItem){
      //if (!winner) {
        let playersCopy = [...players];
        playersCopy.forEach(function(item, i) {
          if (item.name === userName) {
            socket.emit("updateBoard", { room: lobby, winner: playersCopy[i] });
            // socket.on("onUpdateBoard", function(data) {
            // });
          }
        });
      //}
    } else {
      console.log("wrong");
      if (!winner) {
        let playersCopy = [...players];
        playersCopy.forEach(function(item, i) {
          if (item.name === userName) {
            socket.emit("updateBoard", { room: lobby, winner: playersCopy[i] });
            // socket.on("onUpdateBoard", function(data) {
            // });
          }
        });
      }
    }
  };

  return (
    items != "" ? (
    <div className="items">
      {items.map((item, index) => (
        <div
          key={index}
          className={
            item === randomItem && success ? "squareGreen square" : "square"
          }
          onClick={roundsLeft > 0 && !gameWinner ? () => score(item) : () => endMatch()}
          disabled
        >
          <img className="square " src={item} alt={item} />
        </div>
      ))}
    </div>
    ) : 
    <> </>
  );
}

export default Game;
