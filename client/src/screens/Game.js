import React, { useState, useEffect } from "react";
import "../styles/game.css";
import { itemsIcons } from "../assets/Assets";
import StartIcon from "../icons/start-icon.png";
import socketIOClient from "socket.io-client";
//Deploy
const ENDPOINT = window.location.hostname;
//Local
//const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);

function Game() {

  const [items, setItems] = useState(itemsIcons);
  const [randomItem, setRandomItem] = useState("");
  const [success, setSuccess] = useState(false);
  const [userName, setUsername] = useState('');
  const [lobby, setLobby] = useState('');
  const [playerJoined, setPlayerJoined] = useState('');
  const [winner, setWinner] = useState('');
  const [players, setPlayers] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState("");
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {}, [success]);

  const [urlPath, setUrlPath] = useState("");
 

  useEffect(() => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lobbyValue = urlParams.get('lobby');
    if(lobbyValue)
    setLobby(lobbyValue);
    
    let url = window.location.href;    
      if (url.indexOf('?') > -1)
      setUrlPath(window.location.href);

    socket.on('newGame', function(data){
        let url = window.location.href;    
        if (url.indexOf('?') > -1){
          url += '&lobby='+data.room
        }else{
          url += '?lobby='+data.room
        }
        setUrlPath(url);
        setLobby(data.room);
        setPlayerJoined(true);
    });
  
    socket.on('addPlayer', function(data) {
        let player = {};
        player.name = data.name;
        player.id = data.id;
        player.score = 0;
        setPlayers([...players, player]); 
    });

    socket.on('removePlayer', function(data) {
      let filteredArray = players.filter(item => item.id !== data.id)
      setPlayers(filteredArray);
    });
    
    
  }, [ players ]);
 

  const newGame = () => {
    socket.emit('createGame', {name: userName});
  };

  const joinGame = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lobbyParam = urlParams.get('lobby');
    socket.emit('joinGame', { room: lobbyParam, name: userName });
    setPlayerJoined(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(urlPath)
    setCopySuccess('Copied!');
  };


  return (
    <div>
      
    <div className="layout">
      
      <div>
        <Boardgame
          setSuccess={setSuccess}
          randomItem={randomItem}
          setPlayers={setPlayers}
          players={players}
          success={success}
          setButtonDisabled={setButtonDisabled}
          items={items}
          userName={userName}
          winner={winner}
          setWinner={setWinner}
          lobby={lobby}
        />
      </div>
      <div className="selections block">
        <Item
          setItems={setItems}
          randomItem={randomItem}
          setRandomItem={setRandomItem}
          buttonDisabled={buttonDisabled}
          setButtonDisabled={setButtonDisabled}
          setSuccess={setSuccess}
          success={success}
          items={items}
          lobby={lobby}
          setLobby={setLobby}
        />
        <Players players={players} success={success} lobby={lobby} winner={winner} setPlayers={setPlayers}/>
        <br/>
        { urlPath ? (
          <span>
            <input type="text" value={urlPath} readOnly/>
            <button className="refresh block" onClick={copyToClipboard}>Invite</button> 
            {copySuccess}
          </span>) : (<span></span>)
        }
        
        {
          playerJoined ? (<div></div>) : (
            <div className="container">
              { lobby ? (
                <span>
                  <h4>Join game</h4>
                  <input type="text" name="name" id="nameJoin" placeholder="Enter your name" required onChange={event => setUsername(event.target.value)}/>
                  <button id="join" onClick={joinGame} className="button block">Join Game</button>
                </span>
                ) : (
                    <span>
                        <h4>Create a new Game</h4>
                        <input type="text" name="name" id="nameNew" placeholder="Enter your name" required onChange={event => setUsername(event.target.value)} />
                        <button onClick={newGame} className="button block">New Game</button>
                    </span>
                )}
              </div>
          )
        }
        
      </div>
      
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
    setSuccess,
    success,
    setItems,
    items,
    lobby
  } = props;

  useEffect(() => {
    socket.on('onRefresh', function(data) {
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
    });


    socket.on('onNewItem', function(data) {
      setSuccess(false);
      setButtonDisabled(true);
      setRandomItem(itemsIcons[data.itemId]);
    });

  }, [items, setItems, setRandomItem, setSuccess, setButtonDisabled]);

  const random = () => {
    setSuccess(false);
    setButtonDisabled(true);
    const itemId = Math.floor(Math.random() * itemsIcons.length);
    setRandomItem(itemsIcons[itemId]);
    socket.emit('newItem', { room: lobby, itemId: itemId });
  };

  
  const relocate = () => {
    socket.emit('refresh', { room: lobby });
  };

  return (
    <div>
      <img
        className={!success ? "bigIcon neutral" : "bigIcon correct"}
        src={randomItem ? randomItem : StartIcon}
        alt={randomItem}
      />
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
          className={buttonDisabled ? "refreshDisabled block" : "refresh block"}
          disabled={buttonDisabled}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

function Players(props) {
  const { players, success, lobby, winner, setPlayers } = props;

  useEffect(() => {

    socket.emit('getPlayers', { room : lobby});
    socket.on('onGetPlayers', function(data) {
      setPlayers(data.players);
    });

  }, [lobby, setPlayers]);

  
  return (
    <div className="players">
      {success && <p>{winner.name} won the round</p>}
      {players.map((player, index) => (
        <div key={index} className="player">
          <p>{player.name}</p> <p className="score">Score: {player.score}</p>
        </div>
      ))}
    </div>
  );
}

function Boardgame(props) {
  const {
    setPlayers,
    players,
    setButtonDisabled,
    randomItem,
    setSuccess,
    success,
    items,
    userName,
    lobby,
    winner,
    setWinner
  } = props;

  useEffect(() => {
    socket.on('onUpdateBoard', function(data) {
        let playersCopy = [...players];
        playersCopy.forEach(function(item, i){
          if(item.id === data.winner.id) {
            playersCopy[i].score = data.winner.score
            setWinner(playersCopy[i]);
            setPlayers(playersCopy);
            setButtonDisabled(false);
            setSuccess(true);
          }
        });
    });
  }, [players, setButtonDisabled, setSuccess, setPlayers, setWinner, winner]);


  const score = item => {
    if (item === randomItem && !winner) {
      let playersCopy = [...players];
      playersCopy.forEach(function(item, i){
        if(item.name === userName) {
          socket.emit('updateBoard', { room: lobby, winner: playersCopy[i]});
        }
      });
    } else {
      console.log("wrong");
    }
  };

  return (
    <div className="items scroll">
      {items.map((item, index) => (
        <div
          key={index}
          className={
            item === randomItem && success ? "squareGreen square" : "square"
          }
          onClick={() => score(item)}
        >
          <img className="square " src={item} alt={item} />
        </div>
      ))}
    </div>
  );
}

export default Game;
