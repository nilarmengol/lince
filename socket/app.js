const express = require("express");
const http = require("http");
const path = require('path');

const port = process.env.PORT || 4001;

const app = express();
const server = http.createServer(app);

const io = require('./game.socket').init(server);

// serve static files
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

//  handle all requests
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));