let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let players = [];
let food = [];
let field = {
  height: 200,
  width: 300
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a new user connected');
  addNewPlayer(socket);
  
  socket.on("setUsername", username => {
    players[players.findIndex(player => player.socketId === socket.id)].username = username;
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function addNewPlayer(socket){
  newPlayer = {
    socketId: socket.id,
    username: "",
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    size: 10,
    x: Math.floor(Math.random() * field.height),
    y: Math.floor(Math.random() * field.width)
  };
  players.push(newPlayer);
}