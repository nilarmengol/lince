import React, { useState, useEffect } from "react";
import queryString_test from 'query-string'
import "../styles/game.css";
import { itemsIcons } from "../assets/Assets";
import StartIcon from "../icons/start-icon.png";
import io from "socket.io-client";
//Deploy
//const ENDPOINT = window.location.hostname;
//Local
//const ENDPOINT = "http://127.0.0.1:4001/game";
const ENDPOINT = "http://127.0.0.1:4001/";
const socket = io(ENDPOINT);

function Game(props) {
  //const ENDPOINT = "http://127.0.0.1:4001/home";
  // socket = io(ENDPOINT);
  const [items, setItems] = useState(itemsIcons);
  const [randomItem, setRandomItem] = useState("");
  const [success, setSuccess] = useState(false);
  const [userName, setUsername] = useState("");
  const [lobby, setLobby] = useState("");
  const [playerJoined, setPlayerJoined] = useState("");
  const [winner, setWinner] = useState("");
  const [players, setPlayers] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState("");
  const [refreshButtonDisabled, setRefreshButtonDisabled] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {}, [success]);

  const [urlPath, setUrlPath] = useState("");

  useEffect(() => {
    setUsername(props.location.state.userName);
    let queryString = window.location.search;
    queryString = queryString.concat(window.location.hash);
    const urlParams = new URLSearchParams(queryString);
    const lobbyValue = urlParams.get("lobby");

    if (lobbyValue) setLobby(lobbyValue);
    let url = window.location.href;
    if (url.indexOf("?") > -1) setUrlPath(window.location.href);
    socket.on("newGame", function(data) {
      let url = window.location.href;
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
      setPlayers([...players, player]);
    });

    socket.on("removePlayer", function(data) {
      let filteredArray = players.filter(item => item.id !== data.id);
      setPlayers(filteredArray);
    });
  }, [players, setPlayers, setLobby, setPlayerJoined, setUrlPath]);

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
    setPlayerJoined(true);

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
        />
        <Players
          players={players}
          success={success}
          lobby={lobby}
          winner={winner}
          setPlayers={setPlayers}
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
    setWinner
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

  }, [
    items,
    setItems,
    setRandomItem,
    setSuccess,
    setButtonDisabled,
    setRefreshButtonDisabled,
    setWinner
  ]);

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

  // const refresh_image = () => {
  //   setSuccess(false);
  //   setRefreshButtonDisabled(true);
  //   const itemId = Math.floor(Math.random() * itemsIcons.length);
  //   setRandomItem(itemsIcons[itemId]);
  //   socket.emit("refreshItem", { room: lobby, itemId: itemId });
  // };

  // if(success){ refresh_image();}

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
  const { players, success, lobby, winner, setPlayers } = props;

  useEffect(() => {
    socket.emit("getPlayers", { room: lobby});
    socket.on("onGetPlayers", function(data) {
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
    setRefreshButtonDisabled,
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
  }, [
    players,
    setButtonDisabled,
    setRefreshButtonDisabled,
    setSuccess,
    setPlayers,
    setWinner,
    winner
  ]);

  const score = item => {
    if (item === randomItem){
      if (!winner) {
        let playersCopy = [...players];
        playersCopy.forEach(function(item, i) {
          if (item.name === userName) {
            socket.emit("updateBoard", { room: lobby, winner: playersCopy[i] });
            socket.on("onUpdateBoard", function(data) {
            });
          }
        });
      }
    } else {
      console.log("wrong");
    }
  };

  return (
    <div className="items">
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
