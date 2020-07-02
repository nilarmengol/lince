// var ioEvents = function (io) {

//     //maintain room data
//     let gameData = {};

//     io.on("connection", (socket) => {
//         let currentRoomId;
        
//         /**
//          * Disconnect from the room
//          */
//         socket.on("disconnect", () => {
            
//             io.of('/').in(currentRoomId).emit('removePlayer', {
//                 id: socket.id
//             });

//             const sockets = io.nsps['/'].adapter.rooms[currentRoomId];
//             if(!sockets) {
//                 delete gameData[currentRoomId]; //clear room data when all players are gone
//             } 

//         });

//         /**
//          * Create a new game room. 
//          */
//         socket.on('createGame', function (data) {
            
//             const roomId = data.name.split(' ')[0] + '-' + socket.id; //creating private lobby
//             socket.join(roomId);
//             currentRoomId = roomId;

//             socket.emit('newGame', {
//                 name: data.name,
//                 room: roomId
//             });

//             socket.emit('addPlayer', {
//                 name: data.name,
//                 id: socket.id,
//                 score: 0
//             });
            
//             gameData[roomId] = {};
//             gameData[roomId].players = new Array();
//             gameData[roomId].players.push({
//                 name: data.name,
//                 id: socket.id,
//                 score: 0
//             });
//             console.log(gameData)
//         });

//         /**
//          * Connect the Player to the room he requested. Show error if room full.
//          */
//         socket.on('joinGame', function (data) {
//             var room = io.nsps['/'].adapter.rooms[data.room];
            
//             if (room && room.length > 0) {
//                 socket.join(data.room);
//                 currentRoomId = data.room;
              
//                 io.of('/').in(data.room).emit('addPlayer', {
//                     name: data.name,
//                     id: socket.id,
//                     score: 0
//                 });

//                 gameData[data.room].players.push({
//                     name: data.name,
//                     id: socket.id,
//                     score: 0
//                 });
                
//             } else {
//                 socket.emit('err', {
//                     message: 'Sorry, The room is full!'
//                 });
//             }
//         });

//         socket.on('refresh', function (data) {
//             io.of('/').in(data.room).emit('onRefresh');
//         });

//         socket.on('newItem', function (data) {
//             io.of('/').in(data.room).emit('onNewItem', { itemId: data.itemId});
//         });

//         socket.on('updateBoard', function (data) {
//             data.winner.score = data.winner.score +1;
//             io.of('/').in(data.room).emit('onUpdateBoard', { room: data.lobby, winner: data.winner });
//         });

//         socket.on('getPlayers', function (data) {
//             var room = io.nsps['/'].adapter.rooms[data.room];
//             if (room && room.length > 0) {
//                 socket.emit('onGetPlayers', { players: gameData[data.room].players});              
//             } else {
//                 socket.emit('err', {
//                     message: 'Sorry, no player in the room!'
//                 });
//             }
//         });
//     });

// }

// /**
//  * Initialize Socket.io
//  *
//  */
// var init = function (server) {
//     var _io = require('socket.io')(server);
//     // Define all Events
//     ioEvents(_io);
    
//     //load all namespaces
//     //loadNamespaces(_io);
//     return _io;
// }



// module.exports = {
//     init
// };



/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(IO) {

    let gameData = {};

    IO.on('connection', function(socket) {
      
        console.log('connect to /game nsp');

        let currentRoomId;
        
        /**
         * Disconnect from the room
         */
        socket.on("disconnect", () => {
            IO.in(currentRoomId).emit('removePlayer', {
                id: socket.id
            });

            const sockets = IO.adapter.rooms[currentRoomId];
            if(!sockets) {
                delete gameData[currentRoomId]; //clear room data when all players are gone
            } 

        });

        /**
         * Create a new game room. 
         */
        socket.on('createGame', function (data) {
            const roomId = data.name.split(' ')[0] + '-' + socket.id; //creating private lobby
            socket.join(roomId);
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
            gameData[roomId].players.push({
                name: data.name,
                id: socket.id,
                score: 0
            });

            socket.emit('addPlayer', {currentPlayer:addPlayerOptions, allPlayers: gameData[roomId].players });
        });

        /**
         * Connect the Player to the room he requested. Show error if room full.
         */
        socket.on('joinGame', function (data) {
            var room = IO.adapter.rooms[data.room];
            if (room && room.length > 0) {
                socket.join(data.room);
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
                IO.in(data.room).emit('addPlayer', {currentPlayer:addPlayerOptions, allPlayers: gameData[data.room].players });
            } else {
                socket.emit('err', {
                    message: 'Sorry, The room is full!'
                });
            }
        });

        socket.on('refresh', function (data) {
            IO.in(data.room).emit('onRefresh');
        });

        // socket.on('refreshItem', function (data) {
        //     IO.in(data.room).emit('onRefreshItem', { itemId: data.itemId});
        // });

             /**
         * Create a new game room. 
         */
        socket.on('startGame', function (data) {
            IO.in(data.room).emit('startGameRes', {room :data.room});
        });

        socket.on('newItem', function (data) {
            IO.in(data.room).emit('onNewItem', { itemId: data.itemId});
        });

        socket.on('updateBoard', function (data) {
            data.winner.score = data.winner.score +1;
            IO.in(data.room).emit('onUpdateBoard', { room: data.room, winner: data.winner });
        });

        socket.on('getPlayers', function (data) {
            var room = IO.adapter.rooms[data.room];
            if (room && room.length > 0) {
                socket.emit('onGetPlayers', { players: gameData[data.room].players});              
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

