
var ioEvents = function(IO) {

    let gameData = {};
    let socketDetails = {};
    let publicRooms = [];
    let availableRooms = [];


    IO.on('connection', function(socket) {
      
        console.log('connect to /game nsp', gameData);

        let currentRoomId;
        
        /**
         * Disconnect from the room
         */
        socket.on("disconnect", () => {
            console.log("disconnected");
            IO.in(currentRoomId).emit('removePlayer', {
                id: socket.id
            });
            socket.emit('removePlayer', {
                id: socket.id
            });
            const sockets = IO.adapter.rooms[currentRoomId];
            if(!sockets) {
                console.log("delete gameData")
                delete gameData[currentRoomId]; //clear room data when all players are gone
                //delete socketDetails[currentRoomId];
            }
        });
        // socket.on("disconnect", () => {
        //     //console.log("disconnect", localStorage.getItem('userInfo'));
        //     console.log("socket room Id", socketDetails[socket.id])
        //     let roomId = socketDetails[socket.id];
        //     // 
        //     if(gameData[roomId] != undefined && socketDetails[socket.id]!= undefined){
        //         let players = gameData[roomId].players;
        //         console.log("Players", players)

        //         // 
        //         let remove = players.findIndex(function(element){
        //         return element.id===socket.id;
        //         })
        //         if(remove!==-1){
        //             console.log("remove", remove)
        //             players.splice(remove, 1)
        //         }
        //         console.log ("After removing", players);
        //         gameData[roomId].players = players;
        //         // lobby page
        //         IO.in(roomId).emit('onGetPlayers_lobby', { players: gameData[roomId].players}); 

        //         // gamepage
        //         IO.in(roomId).emit('onGetPlayers', { players: gameData[roomId].players});     
        //     }
            
            
        //     // 
        //     IO.in(currentRoomId).emit('removePlayer', {
        //         id: socket.id
        //     });
        //     // const sockets = IO.adapter.rooms[currentRoomId];
        //     // if(!sockets) {
        //     //     console.log("delete gameData")
        //     //     delete gameData[currentRoomId]; //clear room data when all players are gone
        //     // } 

        // });

        socket.on("leaveGame", function (data) {
            console.log("leaveGame", data)
            let socketId = data.id;
            let roomId = socketDetails[socketId];
            // 
            if(gameData[roomId] != undefined && socketDetails[socketId]!= undefined){
            console.log("leaveGame refreshItem",gameData[roomId].refreshItem)

                let players = gameData[roomId].players;
                // 
                let remove = players.findIndex(function(element){
                return element.id===socketId;
                })
                if(remove!==-1){
                    players.splice(remove, 1)
                }
                gameData[roomId].players = players;
                // lobby page
                IO.in(roomId).emit('onGetPlayers_lobby', { players: gameData[roomId].players, playerRemoved: true}); 

                // gamepage
                IO.in(roomId).emit('onGetPlayers', { players: gameData[roomId].players, playerRemoved: true, lobbyValues: gameData[roomId].lobbyValues, refreshItem:gameData[roomId].refreshItem});   
                  
            }

        });

        // check available room for public players

        socket.on('availableRoom', function (data) {
            availableRooms = [];
            console.log("publicRooms", publicRooms);
            publicRooms.forEach((room) => {
                if(gameData[room]){
                    let playerCount = gameData[room].players.length;
                    if(playerCount < 6){
                        availableRooms.push(room);
                    }
                }
            })
            console.log("availableRooms", availableRooms);
            var randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];

            socket.emit("roomAvail", {userName: data.name, roomId: randomRoom});
            //availableRooms.push(roomId);
            //IO.in(data.room).emit('onRefresh');
        });

        /**
         * Create a new game room. 
         */
        socket.on('createGame', function (data) {
            const roomId = data.name.split(' ')[0] + '-' + socket.id; //creating private lobby
            socket.join(roomId);
            // 
            socketDetails[socket.id] = roomId;

            // 
            if(data.public){
                publicRooms.push(roomId) ;
            }

            currentRoomId = roomId;
            socket.emit('newGame', {
                name: data.name,
                room: roomId
            });
            let addPlayerOptions = {
                name: data.name,
                id: socket.id,
                score: 0
            }
            gameData[roomId] = {};
            gameData[roomId].players = new Array();
            // gameData[roomId].lobbyValues = new Array();
            gameData[roomId].players.push({
                name: data.name,
                id: socket.id,
                score: 0
            });

            console.log("createGame gamedata", gameData[roomId])

            //IO.emit('addPlayer', {currentPlayer:addPlayerOptions, allPlayers: gameData[roomId].players });
            socket.emit('addPlayer', {currentPlayer:addPlayerOptions, allPlayers: gameData[roomId].players });
        });

        /**
         * Connect the Player to the room he requested. Show error if room full.
         */
        socket.on('joinGame', function (data) {
            var room = IO.adapter.rooms[data.room];
            if (room && room.length > 0) {
                socket.join(data.room);
                // 
                socketDetails[socket.id] = data.room;
                currentRoomId = data.room;
                let addPlayerOptions = {
                    name: data.name,
                    id: socket.id,
                    score: 0
                }
                //IO.in(data.room).emit('addPlayer', addPlayerOptions);
                
                gameData[data.room].players.push({
                    name: data.name,
                    id: socket.id,
                    score: 0
                });

                // 
                let inGame = false;
                if(gameData[data.room].inGame !== undefined && gameData[data.room].inGame !== ""){
                    inGame = gameData[data.room].inGame;
                }


                IO.in(data.room).emit('addPlayer', {currentPlayer:addPlayerOptions, allPlayers: gameData[data.room].players, inviteUrl: data.inviteUrl, inGame: inGame });
            } else {
                socket.emit('err', {
                    message: 'Sorry, The room is full!'
                });
            }
        });

        socket.on('refresh', function (data) {
            console.log("refresh items", data)
            IO.in(data.room).emit('onRefresh');
        });

        socket.on('refreshItem', function (data) {
            console.log("refreshItem data", data)
            if(data.room && data.itemId){
                console.log("refreshItem data if block", data)
                gameData[data.room].refreshItem = data.itemId;
                IO.in(data.room).emit('onRefreshItem', { itemId: data.itemId});
            }
        });

             /**
         * Create a new game room. 
         */
        socket.on('getRoomDet', function (data) {
            if( IO.adapter.rooms[data.room] != undefined){
                var length = IO.adapter.rooms[data.room].length;
                socket.emit('roomDet', {length:length });
            }
        });

        socket.on('startGame', function (data) {
            var count = IO.adapter.rooms[data.room].length;
            console.log("startGame", data)
            console.log("count", count)
            console.log("IO.adapter.rooms[data.room]", IO.adapter.rooms[data.room])
            if(count >= 2){

                let playersCopy = data.players;
                playersCopy.forEach(function(item, i) {
                    // if (item.id === data.winner.id) {
                    playersCopy[i].inGame = true;
                    //}
                });
                gameData[data.room].players = playersCopy;
                gameData[data.room].inGame = true;
                IO.in(data.room).emit('startGameRes', {room :data.room, name:data.name, err: null});
            }else{
                IO.in(data.room).emit('startGameRes', {err : "Minimum 2 player need to start game"});
            }
        });

        socket.on('LobbyValues', function (data) {
            // gameData[data.room].LobbyValues.push({
            //     difficulty: data.difficulty,
            //     rounds: data.rounds
            // });
            if(gameData[data.room] != undefined && data.room){
                gameData[data.room].lobbyValues = new Array();
                if(gameData[data.room].lobbyValues != undefined){
                    gameData[data.room].lobbyValues = {
                        difficulty: data.difficulty,
                        rounds: data.rounds,
                        roundsLeft: data.rounds
                    };
                }

                console.log("gameData[data.room].lobbyValues", gameData[data.room].lobbyValues)
                
                IO.in(data.room).emit('setLobbyValues', data);
            }
            
        });

        socket.on('getLobbyValues', function (data) {
            if(gameData[data.room] != undefined && data.room){  
                IO.in(data.room).emit('onGetLobbyValues', gameData[data.room].lobbyValues);
            }
        });


        socket.on('anotherGame', function (data) {
            console.log("anotherGame", data);
            let max = data.players.reduce(function (prev, current) {
                return (prev.score > current.score) ? prev : current
             });
            if(gameData[data.room] != undefined && data.room){ 
                
                // rank
                let playersCopy = data.players;
                playersCopy.forEach(function(item, i){
                    if(playersCopy[i].rank == undefined || playersCopy[i].rank==""){
                        playersCopy[i].rank = 0;
                    }
                    if(item.id == max.id){
                        playersCopy[i].rank = playersCopy[i].rank + 1;
                    } 
                    playersCopy[i].score = 0;
                });
                // rank
                gameData[data.room].players = playersCopy;

                IO.in(data.room).emit('onAnotherGame', gameData[data.room].players);
                //socket.emit('onAnotherGame', gameData[data.room].players);
            }

            

        });

        socket.on('groupMsg', function (data) {
            IO.in(data.room).emit('onGroupMsg', {room :data.room, name: data.name, message: data.message});
        });

        socket.on('newItem', function (data) {
            IO.in(data.room).emit('onNewItem', { itemId: data.itemId});
        });

        socket.on('updateBoard', function (data) {
            console.log("updateBoard", data)         
            data.winner.score = data.winner.score +1;
            if(gameData[data.room] != undefined && data.room){ 
                let playersCopy = gameData[data.room].players;
                playersCopy.forEach(function(item, i) {
                    if (item.id === data.winner.id) {
                    playersCopy[i].score = data.winner.score;
                    }
                });
                gameData[data.room].players = playersCopy;
            //gameData[data.room].lobbyValues.roundsLeft =  gameData[data.room].lobbyValues.roundsLeft - 1;

            }
            if(gameData[data.room].lobbyValues.roundsLeft){
            gameData[data.room].lobbyValues.roundsLeft =  gameData[data.room].lobbyValues.roundsLeft - 1;
            }
            // let inGamePlayers = [];
            // let allPlayers = gameData[data.room].players;
            // console.log("getplayers", allPlayers);
            // allPlayers.forEach(function(item, i) {
            //     if (item.inGame == true) {
            //         inGamePlayers.push({ 
            //         name : allPlayers[i].name,
            //         id : allPlayers[i].id,
            //         score : allPlayers[i].score,
            //         inGame : allPlayers[i].inGame
            //         });
            //     }
            // });

            IO.in(data.room).emit('onUpdateBoard', { room: data.room, winner: data.winner, allPlayers:gameData[data.room].players });

        });

        socket.on('getPlayers', function (data) {
            var room = IO.adapter.rooms[data.room];
            if (room && room.length >= 0) {
                socket.join(data.room);

                // let inGamePlayers = [];
                // let playersCopy = gameData[data.room].players;
                // console.log("getplayers", playersCopy);
                // playersCopy.forEach(function(item, i) {
                //     if (item.inGame == true) {
                //         inGamePlayers.push({ 
                //         name : playersCopy[i].name,
                //         id : playersCopy[i].id,
                //         score : playersCopy[i].score,
                //         inGame : playersCopy[i].inGame
                //         });
                //     }
                // });
                //gameData[data.room].players = playersCopy;

                IO.in(data.room).emit('onGetPlayers', { players: gameData[data.room].players, lobbyValues: gameData[data.room].lobbyValues, refreshItem:gameData[data.room].refreshItem}); 
                //socket.emit('onGetPlayers', { players: gameData[data.room].players});     
                //socket.emit('onGetPlayers', { players: inGamePlayers});     
                console.log("onGetPlayers res", gameData[data.room].players)   
                console.log("onGetPlayers lobbyValues", gameData[data.room].lobbyValues)     
                console.log("onGetPlayers refreshItem", gameData[data.room].refreshItem)         
                            
            } else {
                socket.emit('err', {
                    message: 'Sorry, no player in the room!'
                });
            }
        });

        socket.on('getPlayers_lobby', function (data) {
            socket.join(data.room);
            // 
            socketDetails[socket.id] = data.room;           
            var room = IO.adapter.rooms[data.room];
            if (room && room.length >= 0 && gameData[data.room] != undefined && data.room) { 
                IO.in(data.room).emit('onGetPlayers_lobby', { players: gameData[data.room].players});              
            } else {
                socket.emit('err', {
                    message: 'Sorry, no player in the room!'
                });
            }
        });

        socket.on('disconnect', function() {
              
        });
    });

}

/**
 * Initialize /arenas name space
 *
 */
var init = function(server) {
    var _io = require('socket.io')(server);
    var nsp = _io.of('/');
    //var nsp = _io.of('/game');
    // Define all Events
    ioEvents(nsp);
    return _io;
}

module.exports = { init };

