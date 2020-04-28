var ioEvents = function (io) {

    let interval;
    var rooms = 0;

    io.on("connection", (socket) => {
        console.log("New client connected " +socket.id);
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => getApiAndEmit(socket), 1000);
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            clearInterval(interval);
        });

        /**
         * Create a new game room and notify the creator of game. 
         */
        socket.on('createGame', function (data) {
            console.log(data.name)
            socket.join('room-' + socket.id);
            socket.emit('newGame', {
                name: data.name,
                room: 'room-' + rooms
            });
           
        });

        /**
         * Connect the Player 2 to the room he requested. Show error if room full.
         */
        socket.on('joinGame', function (data) {
            var room = io.nsps['/'].adapter.rooms[data.room];
            if (room && room.length == 1) {
                socket.join(data.room);
                socket.broadcast.to(data.room).emit('player1', {});
                socket.emit('player2', {
                    name: data.name,
                    room: data.room
                })
            } else {
                socket.emit('err', {
                    message: 'Sorry, The room is full!'
                });
            }
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
    });

    const getApiAndEmit = socket => {
        const response = new Date();
        // Emitting a new message. Will be consumed by the client
        socket.emit("FromAPI", response);
    };

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