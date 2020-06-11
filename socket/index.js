
var ioEvents = function(io) {
    io.on('connection', function(socket) {
        console.log("Connected to default nsp");   
    });
}

/**
 * Initialize Socket.io
 *
 */
var init = function(server) {
    var _io = require('socket.io')(server);
    // Define all Events
    ioEvents(_io);
    //load all namespaces
    loadNamespaces(_io);
    return _io;
}

var loadNamespaces = function(_io) {
    require('./home.socket').init(_io);
    require('./lobby.socket').init(_io);
    require('./transition.socket').init(_io);
    require('./game.socket').init(_io);
}

module.exports = { init };