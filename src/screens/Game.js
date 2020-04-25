import React, { useState, useEffect } from "react";
import "../styles/game.css";
import { items } from "../assets/Assets";
import StartIcon from "../icons/start-icon.png";

function Game() {
  const [randomItem, setRandomItem] = useState("");
  const [success, setSuccess] = useState(false);
  const [players, setPlayers] = useState([
    {
      name: "Nil",
      id: "181237098142",
      score: 0
    },
    {
      name: "Merce",
      id: "fdgg3452",
      score: 0
    }
  ]);
  const [buttonDisabled, setButtonDisabled] = useState("");

  useEffect(() => {}, [success]);

  return (
    <div className="layout">
      <div className=" ">
        <Boardgame
          setSuccess={setSuccess}
          randomItem={randomItem}
          setPlayers={setPlayers}
          players={players}
          success={success}
          setButtonDisabled={setButtonDisabled}
        />
      </div>
      <div className=" block">
        <Item
          randomItem={randomItem}
          setRandomItem={setRandomItem}
          buttonDisabled={buttonDisabled}
          setButtonDisabled={setButtonDisabled}
          setSuccess={setSuccess}
          success={success}
        />
        <Players players={players} success={success} />
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
    success
  } = props;

  const random = () => {
    setSuccess(false);
    setButtonDisabled(true);
    setRandomItem(items[Math.floor(Math.random() * items.length)]);
  };

  return (
    <div>
      <img
        className={!success ? "bigIcon neutral" : "bigIcon correct"}
        src={randomItem ? randomItem : StartIcon}
        alt={randomItem}
      />

      <button
        className={buttonDisabled ? "disabled block" : "button block"}
        onClick={random}
        disabled={buttonDisabled}
      >
        New Item
      </button>
    </div>
  );
}

function Players(props) {
  const { players, success } = props;

  return (
    <div className="players">
      {success && <p>Nil wins the round</p>}
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
    success
  } = props;

  const score = item => {
    if (item === randomItem) {
      let playersCopy = [...players];
      playersCopy[0].score = playersCopy[0].score + 1;
      setPlayers(playersCopy);
      setButtonDisabled(false);
      setSuccess(true);
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
