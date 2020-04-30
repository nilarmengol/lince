var ioEvents = function (io) {

    let interval;
    let gameData = {};

    io.on("connection", (socket) => {
        let currentRoomId;
        
        socket.on("disconnect", () => {
            
            io.of('/').in(currentRoomId).emit('removePlayer', {
                id: socket.id
            });

            const sockets = io.nsps['/'].adapter.rooms[currentRoomId];
            if(!sockets) {
                delete gameData[currentRoomId];
            } 

        });

        /**
         * Create a new game room and notify the creator of game. 
         */
        socket.on('createGame', function (data) {
            console.log(data.name.split(' ')[0]);
            
            const roomId = data.name.split(' ')[0] + '-' + socket.id; //creating private lobby
            socket.join(roomId);
            currentRoomId = roomId;

           

            socket.emit('newGame', {
                name: data.name,
                room: roomId
            });

            socket.emit('addPlayer', {
                name: data.name,
                id: socket.id,
                score: 0
            });
            
            gameData[roomId] = {};
            gameData[roomId].players = new Array();
            gameData[roomId].players.push({
                name: data.name,
                id: socket.id,
                score: 0
            });
            console.log(gameData)
        });

        /**
         * Connect the Player 2 to the room he requested. Show error if room full.
         */
        socket.on('joinGame', function (data) {
            //console.log('Username: ' + data.room);
            var room = io.nsps['/'].adapter.rooms[data.room];
            
            if (room && room.length > 0) {
                socket.join(data.room);
                currentRoomId = data.room;
              
                io.of('/').in(data.room).emit('addPlayer', {
                    name: data.name,
                    id: socket.id,
                    score: 0
                });

                gameData[data.room].players.push({
                    name: data.name,
                    id: socket.id,
                    score: 0
                });
                
            } else {
                socket.emit('err', {
                    message: 'Sorry, The room is full!'
                });
            }
        });

        socket.on('refresh', function (data) {
            io.of('/').in(data.room).emit('onRefresh');
        });

        socket.on('newItem', function (data) {
            io.of('/').in(data.room).emit('onNewItem', { itemId: data.itemId});
        });

        socket.on('updateBoard', function (data) {
            data.winner.score = data.winner.score +1;
            io.of('/').in(data.room).emit('onUpdateBoard', { room: data.lobby, winner: data.winner });
        });

        /**
         * Handle the turn played by either player and notify the other. 
         */
        socket.on('playTurn', function (data) {
            socket.broadcast.to(data.room).emit('turnPlayed', {
                tile: data.tile,
                room: data.room
            });
        });

        /**
         * Notify the players about the victor.
         */
        socket.on('gameEnded', function (data) {
            socket.broadcast.to(data.room).emit('gameEnd', data);
        });

        socket.on('getPlayers', function (data) {
            var room = io.nsps['/'].adapter.rooms[data.room];
            
            if (room && room.length > 0) {
                socket.emit('onGetPlayers', { players: gameData[data.room].players});              
            } else {
                socket.emit('err', {
                    message: 'Sorry, no player in the room!'
                });
            }
        });
    });

    // const getApiAndEmit = socket => {
    //     const response = new Date();
    //     // Emitting a new message. Will be consumed by the client
    //     socket.emit("FromAPI", response);
    // };

}

/**
 * Initialize Socket.io
 *
 */
var init = function (server) {
    var _io = require('socket.io')(server);
    // Define all Events
    ioEvents(_io);
    return _io;
}

module.exports = {
    init
};