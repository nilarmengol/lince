
/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */

var ioEvents = function(IO) {

    IO.on('connection', function(socket) {
      
        console.log('connect to /transition nsp');

        socket.on('disconnect', function() {
              
        });
    });

}

/**
 * Initialize /arenas name space
 *
 */
var init = function(_io) {
    var nsp = _io.of('/transition');
    // Define all Events
    ioEvents(nsp);
    return _io;
}

module.exports = { init };