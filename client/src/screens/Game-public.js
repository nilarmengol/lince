import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import queryString_test from 'query-string'
import "../styles/game.css";
import { itemsIcons_all } from "../assets/Assets";
import StartIcon from "../icons/start-icon.png";
import io from "socket.io-client";


//import 'font-awesome/css/font-awesome.min.css';

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
import Modal from 'react-bootstrap/Modal';


//Deploy
const ENDPOINT = window.location.hostname;
//Local
//const ENDPOINT = "http://127.0.0.1:4001/";
const socket = io(ENDPOINT);

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
  const history = useHistory();
  const [totalRounds, setTotalRounds] = useState("10");
  const [rounds, setRounds] = useState(1);
  const [roundsLeft, setRoundsLeft] = useState("");
  const [gameWinner, setGameWinner] = useState("");
  const [msgs, setMsg] = useState("");
  const [allMsg, setAllMsg] = useState("");
  const [userMsg, setUserMsg] = useState("");
  //const [countdown, setCountdown] = useState("3");
  const [modalShow, setModalShow] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminButtonDisabled, setAdminButtonDisabled] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const [temp, setTemp] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [refreshItem, setRefreshItem] = useState("");
  const [randomImg, setRandomImg] = useState(false);

  //
  const [defaultImg, setDefaultImg] = useState(true);



  useEffect(() => {
    if(players){
      socket.on("onUpdateBoard", function(data) {
          let playersCopy = data.allPlayers;
          playersCopy.forEach(function(item, i) {
            //if (item.id === data.winner.id && !winner) {
            if (item.id === data.winner.id) {
              playersCopy[i].score = data.winner.score;
              setWinner(playersCopy[i]);
            }
          });
          setPlayers(playersCopy)
          setButtonDisabled(false);
          setRefreshButtonDisabled(false);
          setSuccess(true);
      });
    }
  }, []);


  useEffect(() => {}, [success]);

  useEffect(() => {
    if(msgs){
    setAllMsg([...allMsg, msgs]);
    }
    
  }, [msgs]);

  useEffect(() => {
    if(winner){
    //if(winner.score > totalRounds/3){
     if(winner.score > totalRounds/players.length){
        setGameWinner(winner);
      }else{
        setRoundsLeft(roundsLeft - 1);
        if(rounds<=totalRounds){setRounds(rounds + 1)};
      }  
    }
  }, [winner]);


  useEffect(() => {
    if(gameWinner != ""){
      setModalShow(true);
    }
  }, [gameWinner]);



  // useEffect(() => {
  //   console.log("randomImg", randomImg)
  //   console.log("randomImg lobby", lobby)

  //   if(randomImg == true && lobby){
  //     console.log("randomImg items", items)
  //     socket.emit("setItems", {room: lobby, items: items})
  //   }
  // }, [lobby, randomImg]);




  useEffect(() => {
    if(defaultImg == true){
      let itemsIcons = "";
      switch (difficulty) {
        case '1':
          itemsIcons = itemsIcons_all.slice(0, 200);
          //setItems(itemsIcons_all.slice(0, 200));
          break;
        case '2':
          itemsIcons = itemsIcons_all.slice(0, 300);
          //setItems(itemsIcons_all.slice(0, 300));
          break;
        case '3':
          itemsIcons = itemsIcons_all.slice(0, 500);
          //setItems(itemsIcons_all.slice(0, 500));
          break;
        default:
          itemsIcons = itemsIcons_all.slice(0, 400);
          //setItems(itemsIcons_all.slice(0, 400));
          break;
      }
      itemsIcons ? setItems(itemsIcons) : setItems("");

      if(itemsIcons){
        if((parseInt(roundsLeft) % 10 == 0 || roundsLeft == "") && lobby){


          const itemId = Math.floor(Math.random() * itemsIcons.length);
          setRandomItem(itemsIcons[itemId]);
          socket.emit("newItem", { room: lobby, itemId: itemId });


          console.log("-----------------------onRefresh--------")
          let copyItems = [...itemsIcons];
          let array = copyItems;
          let currentIndex = array.length;
          // While there remain elements to shuffle...
          while (0 !== currentIndex) {
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            console.log("currentIndex", currentIndex)

            // And swap it with the current element.
            let temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }
          setItems(array);
          setRandomImg(true);
          console.log('array', array);
          socket.emit("setItems", {room: lobby, items: array})
        }
      }

    }  
    
  }, [lobby, defaultImg]);
  //}, [difficulty, lobby, defaultImg, randomImg]);

  //}, [difficulty]);

  useEffect(() => {
    let queryString = window.location.search;
    queryString = queryString.concat(window.location.hash);
    const urlParams = new URLSearchParams(queryString);
    const lobbyValue = urlParams.get("lobby");

    // if(props.location.state.totalRounds === undefined){
    //     history.push("/");
    //   }
    // if(props.location.state.totalRounds != undefined){
    //   setTotalRounds(props.location.state.totalRounds);
    //   setRoundsLeft(props.location.state.totalRounds);
    // }
    // if(props.location.state.difficulty != undefined && props.location.state.difficulty !==""){
    //   setDifficulty(props.location.state.difficulty);
    // }
    
    //const difficulty = props.location.state.difficulty;
    
    // let itemsIcons = "";
    // switch (difficulty) {
    //   case '1':
    //     itemsIcons = itemsIcons_all.slice(0, 200);
    //     setItems(itemsIcons_all.slice(0, 200));
    //     break;
    //   case '2':
    //     itemsIcons = itemsIcons_all.slice(0, 300);
    //     setItems(itemsIcons_all.slice(0, 300));
    //     break;
    //   case '3':
    //     itemsIcons = itemsIcons_all.slice(0, 500);
    //     setItems(itemsIcons_all.slice(0, 500));
    //     break;
    //   // default:
    //   //   itemsIcons = itemsIcons_all.slice(0, 400);
    //   //   setItems(itemsIcons_all.slice(0, 400));
    //   //   break;
    // }
    // itemsIcons ? setItems(itemsIcons) : setItems("")

    socket.on("onGroupMsg", function(data) {
      let msg = {};
      msg.name = data.name;
      msg.message = data.message;
      setMsg(msg);
    });

    //setCountdown("3");


  }, []);




  const [urlPath, setUrlPath] = useState("");

  useEffect(() => {
    setUsername(props.location.state.userName);
    let queryString = window.location.search;
    queryString = queryString.concat(window.location.hash);
    const urlParams = new URLSearchParams(queryString);
    const lobbyValue = urlParams.get("lobby");

    console.log("lobby", lobbyValue)

    if (lobbyValue) setLobby(lobbyValue);
    let url = window.location.href;
    if(lobby == ""){
      setLobby(localStorage.getItem('lobby'));
    }

    let user;
    if(localStorage.getItem('userInfo') != null){
      user = JSON.parse(localStorage.getItem('userInfo'));
    }
    if(players.length > 0){
      setAdminName(players[0].name)
      if(user.id == players[0].id){
        setAdminButtonDisabled(false)
      }
    }

    // socket.on("removePlayer", function(data) {
    //   console.log("remove player", data);
    //   socket.emit("leaveGame", { id: data.id});
    //   history.push("/");
    //   let filteredArray = players.filter(item => item.id !== data.id);
    //   //setPlayers(filteredArray);
    // });
    

  }, [players]);

  useEffect(() => {

    console.log("lobby", lobby);
    console.log("players", players);

    if(lobby && players.length == 0){
      socket.on("onGetPlayers", function(data) {
        setPlayers(data.players);
        console.log("onGetPlayers", data);
        //if(data.playerRemoved != undefined && data.playerRemoved == true){
          let user = JSON.parse(localStorage.getItem('userInfo'));
          let remove = 0;
          let remove1 = 0;
          data.players.forEach(function(item, i){
              if(item.id == user.id){
                  remove++;
              } 
              if(item.inGame == undefined){
                remove1++;
              }
              
          });
          if(remove == 0){
            history.push("/");
          }
          //if(data.playerRemoved ==true){
            console.log("players inGAme remove1", remove1);
            // if(remove1 == 0 || data.playerRemoved != true){
            //   setCountdown("3")
            // }else{
            //   setCountdown("-2");
            // }
            
            //if(remove1 > 0 || data.playerRemoved == true){
            if(data.refreshItem != undefined || data.playerRemoved == true){
              setCountdown("-2")
              //setCountdown("3");

            }else{
              setCountdown("3");
            }
          //}
        //}  


        // 
        if(data.lobbyValues != undefined){
          setTotalRounds(data.lobbyValues.rounds);
          setRoundsLeft(data.lobbyValues.roundsLeft);
          setDifficulty(data.lobbyValues.difficulty);
          setRounds(data.lobbyValues.rounds - data.lobbyValues.roundsLeft + 1 )
        }else{
          setTotalRounds(10);
          setRoundsLeft(10);
          setDifficulty("2");
        }

        if(data.refreshItem != undefined){
          //setRandomItem(items[data.refreshItem]);
          setRefreshItem(data.refreshItem)
        }
        // }else{
        //     const itemId = Math.floor(Math.random() * itemsIcons_all.length);
        //     setRandomItem(itemsIcons_all[itemId]);
        // }
        // 

      });

      // 
      socket.emit("getLobbyValues", {room: lobby})
      // 

    }
    console.log("lobby");
    let user = JSON.parse(localStorage.getItem('userInfo'));
    socket.on("removePlayer", function(data) {
      console.log("remove player", data);
      socket.emit("leaveGame", { id: data.id});
      // console.log("user.id", user.id);
      // console.log("data.id", data.id);
      // if(user.id == data.id){
      //   history.push("/");
      // }
      let filteredArray = players.filter(item => item.id !== data.id);
      //setPlayers(filteredArray);
    });


  }, [lobby]);


  useEffect(() =>{

    if(lobby && rounds){
      socket.emit('getItems', {room:lobby, round:rounds});
    }
    socket.on("onGetItems", function(data) {
      console.log("onGetItems", data);
      if(data.items && data.items.length > 0 || data.items== null){
        console.log('items', data.items);
        setDefaultImg(false);
        setItems(data.items);
        //setRefreshItem(data.refreshItem);
        setRandomItem(data.items[data.refreshItem]);
        
      }else{
        setDefaultImg(true);
      }
    });

  }, [lobby, players])


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
          countdown={countdown}
          setLobby={setLobby}
          rounds={rounds}
          setTemp={setTemp}
          temp={temp}
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
          gameWinner={gameWinner}
          difficulty={difficulty}
          players={players}
          userName={userName}
          history={history}
          refreshItem={refreshItem}
          setRandomImg={setRandomImg}
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
          rounds={rounds}

        />

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          gamewinner={gameWinner}
          lobby={lobby}
          players={players}
          setplayers={setPlayers}
          setroundsleft={setRoundsLeft}
          setrounds = {setRounds}
          totalrounds ={totalRounds}
          setmodalshow={setModalShow}
          setgamewinner={setGameWinner}
          buttondisabled={adminButtonDisabled}
          setwinner={setWinner}
          setsuccess={setSuccess}
          setlobby={setLobby}
        />

        <br />
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
    setCountdown,
    gameWinner,
    history,
    difficulty,
    userName,
    players,
    refreshItem,
    setRandomImg


  } = props;

  useEffect(() => {
    // socket.on("onRefresh", function(data) {
    //   console.log("-----------------------onRefresh", data)
    //   let copyItems = [...items];
    //   let array = copyItems;
    //   let currentIndex = array.length;
    //   // While there remain elements to shuffle...
    //   while (0 !== currentIndex) {
    //     // Pick a remaining element...
    //     let randomIndex = Math.floor(Math.random() * currentIndex);
    //     currentIndex -= 1;

    //     console.log("currentIndex", currentIndex)

    //     // And swap it with the current element.
    //     let temporaryValue = array[currentIndex];
    //     array[currentIndex] = array[randomIndex];
    //     array[randomIndex] = temporaryValue;
    //   }
    //   setItems(array);
    //   setRandomImg(true);
    //   console.log('array', array);
    //   socket.emit("setItems", {room: data.room, items: array})

    //   setRefreshButtonDisabled(true);
       
    // });

    // socket.on("onNewItem", function(data) {
    //   setWinner("");
    //   setSuccess(false);
    //   setButtonDisabled(true);
    //   setRefreshButtonDisabled(true);
    //   setRandomItem(itemsIcons[data.itemId]);
    // });


  }, [items, lobby, rounds, countdown]);


  useEffect(() => {
    if(countdown != "-2"){
      socket.on("onRefreshItem", function(data) {
        setWinner("");
        setSuccess(false);
        setButtonDisabled(false);
        setRefreshButtonDisabled(true);
        setRandomItem(itemsIcons[data.itemId]);
      });
    }
  }, [items]);

  useEffect(() => {
    if(success && gameWinner ==""){
      setCountdown("3");
    }
  }, [success]);


  // let user;
  // if(localStorage.getItem('userInfo') != null){
  //   user = JSON.parse(localStorage.getItem('userInfo'));
  // }
  // if(players.length > 0){
  //   setAdminName(players[0].name)
  //   if(user.id == players[0].id){
  //     setAdminButtonDisabled(false)
  //   }
  // }



  useEffect(() => {
    if(countdown != "-2"){
      countdown >= 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
      // // 
      let user;
      if(localStorage.getItem('userInfo') != null){
        user = JSON.parse(localStorage.getItem('userInfo'));
        // console.log("user", user)
        // console.log("players", players)
      }
      // // 
      //console.log("adminButtonDisabled", adminButtonDisabled)
      if(players.length > 0 && user.id == players[0].id){
      console.log("countdown check", countdown)
        if(countdown == 0 ){
          refresh_image();
        }

      }
    }else{
      console.log("refreshItem",refreshItem)
      if(refreshItem != ""){  
        setRandomItem(itemsIcons[refreshItem]);
      }
    }
  }, [countdown, refreshItem, items]);

  useEffect(() => {

    console.log("refreshItem test",refreshItem)
    if(refreshItem != ""){  
      setRandomItem(itemsIcons[refreshItem]);
    }
  }, [refreshItem]);

  // useEffect(() => {
  //   console.log("obby test", roundsLeft)
  //   if((parseInt(roundsLeft) % 10 == 0 || roundsLeft == "") && lobby){
  //     console.log("------------------if block-------------")
  //     //relocate(); 
  //     let copyItems = [...items];
  //     let array = copyItems;
  //     let currentIndex = array.length;
  //     // While there remain elements to shuffle...
  //     while (0 !== currentIndex) {
  //       // Pick a remaining element...
  //       let randomIndex = Math.floor(Math.random() * currentIndex);
  //       currentIndex -= 1;

  //       console.log("currentIndex", currentIndex)

  //       // And swap it with the current element.
  //       let temporaryValue = array[currentIndex];
  //       array[currentIndex] = array[randomIndex];
  //       array[randomIndex] = temporaryValue;
  //     }
  //     setItems(array);
  //     setRandomImg(true);
  //     console.log('array', array);
  //     socket.emit("setItems", {room: lobby, items: array})

  //     setRefreshButtonDisabled(true);
  //   }
  // }, [lobby, roundsLeft]);

  const random = () => {
    setSuccess(false);
    setButtonDisabled(true);
    setRefreshButtonDisabled(true);
    const itemId = Math.floor(Math.random() * itemsIcons.length);
    setRandomItem(itemsIcons[itemId]);
    socket.emit("newItem", { room: lobby, itemId: itemId });
  };

  const relocate = () => {
    if(lobby){
      socket.emit("refresh", { room: lobby });
    }
  };

  const refresh_image = () => {
    setSuccess(false);
    setRefreshButtonDisabled(true);
    const itemId = Math.floor(Math.random() * itemsIcons.length);
    setRandomItem(itemsIcons[itemId]);
    socket.emit("refreshItem", { room: lobby, itemId: itemId });
  };

  const backToLobby = () => {
    history.push("/lobby?lobby="+lobby, {userName: userName, totalRounds: rounds, players: players, difficulty:difficulty});
  }

  const backToMain = () => {
    history.push("/");
  }

  const leaveGame = () => {
    let currentPlayer = JSON.parse(localStorage.getItem('userInfo'));
    socket.emit("leaveGame", { id: currentPlayer.id});
    history.push("/");
  };

  return (
    <div>
      <div className="text-center">
        <h5>{rounds}/{totalRounds} Rounds</h5>
      </div>
      {countdown < 0 ? (
        <img
        className={!winner ? "bigIcon neutral" : "bigIcon correct"}
        src={randomItem ? randomItem : StartIcon}
        alt={randomItem}
      />
      ): (
      <div 
      className="bigIcon neutral countdownDiv"
      className={!winner ? "bigIcon neutral countdownDiv" : "bigIcon correct countdownDiv"}
      >
        {countdown == 0 ? "Start" : countdown}
      </div>)}
      <div className="text-center pt-2 pb-2">
        {/* <button className="btn btn-secondary  btn-rounded btn-sm" onClick={relocate}><FaBeer /> Refresh</button>
        <br></br> */}
        <button className="btn btn-secondary  btn-rounded btn-sm mt-2" onClick={leaveGame}><i class="fa fa-arrow-left mr-1"></i> Leave Game</button>
      </div>
    </div>
  );
}


function MyVerticallyCenteredModal(props) {
  const {gamewinner, lobby, players, setplayers, setroundsleft, totalrounds, setmodalshow, setrounds, setgamewinner, buttondisabled, setwinner, setsuccess, setlobby} = props;

  useEffect(() => {
    if(lobby){
      socket.on("onAnotherGame", function(data) {
        setplayers(data);
        setrounds(1);
        setroundsleft(totalrounds);
        setmodalshow(false);
        setgamewinner("");
        setwinner("");
        setsuccess(false);
      });
    }
  }, [lobby])

  const anotherGameBtn = () => {
    socket.emit("anotherGame", { room: lobby, players: players, gameWinner: gamewinner });
  }  

  const leaveGameBtn = () => {
    console.log("Leave Game")
  } 

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Match Result
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="textCenter">
        <p>
          <strong>{gamewinner.name}</strong> Won the game!!!
        </p>
      </Modal.Body>
      <Modal.Footer>
      <Button disabled={buttondisabled} onClick={anotherGameBtn}>Try Again</Button>
      <Button variant="outline-danger" onClick={leaveGameBtn}>Leave Game</Button>
      </Modal.Footer>
    </Modal>
  );
}


function Players(props) {
  const { players, success, lobby, winner, setPlayers, gameWinner, roundsLeft, totalRounds, setUserMsg, userMsg, userName, allMsg, rounds } = props;

  const [currentlyTyping, setCurrentlyTyping ] = useState([]);

  useEffect(() => {
      if(lobby){
        socket.emit("getPlayers", { room: lobby});
      }
      socket.on('notifyTyping',function(data){
        console.log("notifyTyping", data);
        var result = data.typing.filter(name => name != userName);
        setCurrentlyTyping(result);
      });
  }, [lobby]);

  function handleChange(e) {
    setUserMsg(e.target.value);
  }

  function handleSubmit() {
    if(userMsg){
    socket.emit("groupMsg", { room: lobby,name: userName, message: userMsg});
    setUserMsg("");
    }
  }

  const messagesEndRef = useRef()

  const scrollToBottom = () => {
    console.log("new message");
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  let user;
    if(localStorage.getItem('userInfo') != null){
      user = JSON.parse(localStorage.getItem('userInfo'));
    }


  // const msgKeyDown = () =>{
  //   console.log("typing", userName);
  //   socket.emit('typing', {room:lobby, userName:userName});

  //   socket.on('notifyTyping',function(data){
  //     console.log("notifyTyping", data);
  //     if (data.typing.length > 0) {
  //       if (!data.typing.some(element => element === userName)) {
  //         data.typing.push(userName);
  //         }
  //     } else {
  //       data.typing.push(userName);
  //     }

  //     setCurrentlyTyping(data.typing);
  //   });
  // }

 

  // const msgKeyUp = () =>{
  //   console.log("typing up", userName);
  //   // setTimeout(function(){
  //   // socket.emit('stopTyping', {room:lobby, userName:userName});
  //   // }, 3000);

  //   // socket.on('notifyStopTyping',function(data){
  //   //   console.log("notifyTyping", data);
  //   //   setCurrentlyTyping(data.typing);
  //   // });
  // }

  var timeout;

  function timeoutFunction() {
    socket.emit('stopTyping', {room:lobby, userName:userName});
    // socket.on('notifyTyping',function(data){
    //   console.log("notifyTyping", data);
    //   setCurrentlyTyping(data.typing);
    // });
  }

  const msgKeyDown = () =>{
    console.log("typing", userName);
    socket.emit('typing', {room:lobby, userName:userName});

    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 2000);

    // socket.on('notifyTyping',function(data){
    //   console.log("notifyTyping", data);
    //   setCurrentlyTyping(data.typing);
    // });
  }


  const msgKeyUp = () =>{
    console.log("typing up", userName);
    // setTimeout(function(){
    // socket.emit('stopTyping', {room:lobby, userName:userName});
    // }, 3000);

    // socket.on('notifyStopTyping',function(data){
    //   console.log("notifyTyping", data);
    //   setCurrentlyTyping(data.typing);
    // });
  }

  let typingText = '';
  if (currentlyTyping.length === 1) {
  typingText = `${currentlyTyping[0]} is typing `;
  } else if (currentlyTyping.length === 2) {
  typingText = `${currentlyTyping[0]} and ${currentlyTyping[1]} are typing `;
  } else if (currentlyTyping.length > 2) {
  typingText = `Several people are typing `;
  } else {
  typingText = '';
  }

  const typingAnimation = (
    <React.Fragment>
    <span className='typing-dot'></span>
    <span className='typing-dot'></span>
    <span className='typing-dot'></span>
    </React.Fragment>
  );
  

  useEffect(() => {
      if(allMsg !=""){
        scrollToBottom();
      }
    },[allMsg]);

  return (
    <>
      
    <div className="players">
      {roundsLeft != 0 && !gameWinner && success && <p>{winner.name} won the round</p>}
      { rounds !== 1 && gameWinner && <div className="pb-2"><p>{gameWinner.name} won the game</p></div>}
      {roundsLeft == 0 && winner.score == totalRounds/2 && <p>Match Draw</p>}
      {players.map((player, index) => (
        <div key={index} className={`player player_${index}`}>
          <p><i class="fa fa-user mr-1"></i>{player.name}</p> <p className="score">Score: {player.score} {player.rank >= 0 && "Rank: "+player.rank} </p>
        </div>
      ))}
    </div>

    {players.length > 0 && <Card fluid="true" className="mt-3">
    <Card.Header className="text-left"><h5>Chat</h5></Card.Header>
    <Card.Body>
      <div className="chatWindow">
        {allMsg != "" ? (
        <ul className="chat" id="chatList">
          <span className="typing">{typingText} {typingText ? typingAnimation : ''}</span>
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
              <div ref={messagesEndRef} />
            </div>) : <></>
          ))}
        </ul>) : (
        <ul className="chat" id="chatList">
          <span className="typing">{typingText} {typingText ? typingAnimation : ''}</span>
          </ul>) 
          }
        <div className="chatInputWrapper">
          <form >
            <div className="message_input ">
              {/* <span className="typing">{typingText} {typingText ? typingAnimation : ''}</span> */}
              <input
                id="message-box"
                className="textarea input "
                type="text"
                placeholder="Enter your message..."
                value={userMsg}
                onChange={handleChange}
                onKeyDown={msgKeyDown}
                onKeyUp={msgKeyUp}
              />
              <span className="message_submit" >
                <Icon.CursorFill color="royalblue" size={50} onClick={handleSubmit} />
                </span>
            </div>
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
    setCountdown, 
    countdown,
    setLobby,
    rounds,
    setTemp,
    temp
  } = props;

  const endMatch = item => {
    console.log("end match")
  }  

  const score = item => {

    let user;
    if(localStorage.getItem('userInfo') != null){
      user = JSON.parse(localStorage.getItem('userInfo'));
    }


    if (item === randomItem){
      if (countdown < 0) {
        let playersCopy = [...players];
        playersCopy.forEach(function(item, i) {
          if (item.id === user.id) {
            socket.emit("updateBoard", { room: lobby, winner: playersCopy[i] });
          }
        });
      }  
    } else {
      console.log("wrong", countdown);
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
          <img className={`square ${index}`} src={item} alt={item} />
        </div>
      ))}
    </div>
    ) : 
    <> </>
  );
}

export default Game;
