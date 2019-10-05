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

  socket.on('updateState', data => {
    updatePlayer(data, socket.id);
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
    r: 10, 
    size: 10
  };
  players.push(newPlayer);
}

function updatePlayer({x, y, r}, socketId){
  playerIndex = players.findIndex(player => player.socketId === socketId);
  players[playerIndex].x = x;
  players[playerIndex].y = y;
  players[playerIndex].r = r;
}