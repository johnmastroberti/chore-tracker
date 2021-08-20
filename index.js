const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const Database = require('./lib/database');

Database.initDatabase();


//Database.getChores((list)=>{console.log(list)});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.js"));
});

const host = fs.readFileSync('/etc/hostname');
let HOST = "localhost";
const PORT = 8080;
if (host == 'johnvps')
  HOST = "doghousecooking.com"

app.get('/host.js', (req, res) => {
  res.send(`const HOST = \"${HOST}\"\nconst PORT=${PORT}`);
});


// app.get('/socket.io/socket.io.js', (req, res) => {
//   res.sendFile("node_modules/socket.io/client-dist/socket.io.js", {root: __dirname + "/.."});
// });


// console.log("Routes: ", app._router.stack);

io.on('connection', (socket) => {
  // Serve clients a full list of chores
  socket.on('get-chores', () => {
    Database.getChores((choreList) => {
      socket.emit('chore-list', choreList);
    });
  });
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
  switch (eventName) {
    case 'chore-complete':
      Database.setChoreStatus(choreName, 1);
      break;
    case 'chore-uncomplete':
      Database.setChoreStatus(choreName, 0);
      break;
  }
}

server.listen(8080);
