const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const Database = require('./lib/database');
const importChores = require('./lib/import-chores');

Database.initDatabase();

importChores('chores.csv');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.js"));
});

// app.get('/socket.io/socket.io.js', (req, res) => {
//   res.sendFile("node_modules/socket.io/client-dist/socket.io.js", {root: __dirname + "/.."});
// });


// console.log("Routes: ", app._router.stack);

io.on('connection', (socket) => {
  // Handle chore completion
  const events = ['chore-complete', 'chore-uncomplete'];
  for (const event of events) {
    socket.on(event, (choreName) => {
        updateDatabase(event, choreName);
        io.emit(event, choreName);
    });
  }
});


function updateDatabase(eventName, choreName) {
  console.log(`Processing event "${eventName}" for chore "${choreName}"...`);
}

server.listen(8080);
