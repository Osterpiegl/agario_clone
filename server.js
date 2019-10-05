let express = require('express');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let players = [];
let food = [];
let field = {
  height: 200,
  width: 300
};

app.use(express.static('public'));

io.on('connection', function(socket){
  console.log('New user with id: ' + socket.id);
  addNewPlayer(socket);
  
  socket.on('setPlayerName', playerName => {
    players[players.findIndex(player => player.socketId === socket.id)].playerName = playerName;
  });

  socket.on('updateState', (player) => {
    updatePlayer(player, socket.id);
    io.emit("updateState", {
      players: players,
      food: food
    });
  })

  socket.on('disconnect', function(){
    player = players[players.findIndex(player => player.socketId === socket.id)];
    if (player) {
      console.log(player.playerName + ' disconnected');
      players = players.filter(player => player.socketId !== socket.id)
    }
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

function addNewPlayer(socket){
  newPlayer = {
    socketId: socket.id,
    playerName: '',
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    size: 10,
    x: Math.floor(Math.random() * field.height),
    y: Math.floor(Math.random() * field.width)
  };
  players.push(newPlayer);
}

function updatePlayer(player, socketId){
  playerIndex = players.findIndex(player => player.socketId === socketId);
  players[playerIndex].x = player.x;
  players[playerIndex].y = player.y;
  players[playerIndex].size = player.size;
}