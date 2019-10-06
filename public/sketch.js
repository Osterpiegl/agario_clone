// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

let socket;
let dots, players, player, items;

function preload() {}
const vel = 3;
const EATING_THRESHOLD = 5*5;
const DOT_BASE_SIZE = 10;
const PLAYER_BASE_SIZE = 30;

class Dot {
  constructor(
    x,
    y,
    size = DOT_BASE_SIZE,
    color = color(random(255), random(255), random(255))
  ) {
    this.pos = createVector(x, y);
    this.size = size / 2;
    this.color = color;
  }

  changeColor() {
    this.color = color(random(255), random(255), random(255));
  }

  show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
  };

  intersects(other) {
    var d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < this.size + other.size) {
      return true;
    } else {
      return false;
    }
  }
}

class Player extends Dot {
  constructor(
    x = 1,
    y = 1,
    size = PLAYER_BASE_SIZE,
    name,
    color = color(random(255), random(255), random(255))
  ) {
    super(x, y, size, color);
    this.vel = createVector(0, 0);
    this.name = name;
  }

  update() {
    const newVelocity = createVector(mouseX - width / 2, mouseY - height / 2);
    newVelocity.div(50);
    newVelocity.setMag(3);
    newVelocity.limit(3);
    this.vel.lerp(newVelocity, 0.2);
    this.pos.add(this.vel);
  }

  canEat(dot) {
    if (this.size*this.size*PI > dot.size*dot.size*PI + EATING_THRESHOLD) {
      return true;
    } else {
      return false;
    }
  }

  eat(i) {
      this.size = Math.sqrt(this.size*this.size+dots[i].size*dots[i].size);
      dots = [...dots.slice(0, i), generateRandomDot(),...dots.slice(i+1)];
      items = [...dots, ...players]
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomDot() {
  const randX = randomIntFromInterval(0, w);
  const randY = randomIntFromInterval(0, h);
  const randColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
  const size = 10;
  return new Dot(randX, randY, size, randColor);
}

function playerCanEat(p1, p2) {
  if (p1.size - EATING_THRESH_HOLD > p2.size) {
    return true;
  } else if (p2.size - EATING_THRESH_HOLD > p1.size) {
    return false;
  } else {
    return false;
  }
}

function resetPlayer(player) {
  let p = player;
  p.size = 10;
  p.x = random(w);
  p.y = random(h);
  return p;
}

function setup() {
  dots = Array(15)
    .fill(undefined)
    .map(item => {
      return generateRandomDot();
    });
  players = []
  player = new Player(100, 50, 30, "fufu", 255);
  items = [...players, ...dots];

  socket = io.connect("http://localhost:3000");
  //const playerIds = players.map(singlePlayer => singlePlayer.id)
  // socket.on("updateState", (data)=> {
  //   let playerGG = []
  //   data.players.forEach(player => {
  //     playerGG.push(
  //       new Player(player.x, player.y, player.size, player.playerName)
  //     )
  //   })

  //   players = playerGG
  //   items = [...players, ...dots];

    

    // const {players: serverPlayers} = data
    // serverPlayers.forEach(player => {
    //   if (playerIds.includes(player.id)) {
    //     players[player.id].x = player.x;
    //     players[player.id].y = player.y;
    //     players[player.id].size = player.size;
    //   } else {

    //   }
    // }
    // serverPlayers.forEach(player => { if (players[id] === players.id){
      
    // }})
    // console.log(serverPlayers); })
  createCanvas(600, 400);
  background(155);
}

function draw() {
  background(100);
  translate(width / 2, height / 2);
  const zoomFactor = 30/player.size
  scale(zoomFactor)
  translate(-player.pos.x, -player.pos.y);
  player.update();
  for (let i = 0; i < items.length; i += 1) {
    let item = items[i];
    item.show();
    if (player.intersects(item) && player.canEat(item)) {
      player.eat(i);
    }
  }
  player.show();
    const data = { x: player.pos.x, y: player.pos.y, size: player.size };
    socket.emit("updateState", data);
  
}
