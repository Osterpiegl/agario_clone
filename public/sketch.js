// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

let socket;
let foodArray, players, player, items;

function preload() {}
const vel = 3;
const EATING_THRESHOLD = 5 * 5;
const DOT_BASE_SIZE = 20;
const PLAYER_BASE_SIZE = 25;
const SIZE = 2;
const BOARD_SIZE_Y = SIZE * h;
const BOARD_SIZE_X = SIZE * w;

class Dot {
  constructor(
    x = 0,
    y = 0,
    size = DOT_BASE_SIZE,
    color = color(255, 255, 255)
  ) {
    this.pos = createVector(x, y);
    this.size = size / 2;
    this.color = color;
  }
  show() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
  }
}

class Food extends Dot {
  constructor(x = randomXCoord(), y = randomYCoord()) {
    super(x, y, randomFoodSize(), randomColor());
  }
}

class EjectedMatter extends Dot {
  constructor(pos, vel) {
    super(pos.x, pos.y, randomFoodSize(), randomColor(), color(0, 100, 50));
    this.vel = vel;
  }
  speedDecay() {
    if (this.velMag > 0){
      this.velMag = this.velMag - 0.1;
      this.vel.setMag(this.velMag)
    }
  }
  update() {
    this.pos.add(this.vel)
  }
}

class Player extends Dot {
  constructor(
    x = 1,
    y = 1,
    size = PLAYER_BASE_SIZE,
    name,
    color = color(random(255), random(255), random(255)),
    stop = false
  ) {
    super(x, y, size, color);
    this.vel = createVector(0, 0);
    this.name = name;
  }

  update() {
    if (this.stop) return;

    const newVelocity = createVector(mouseX - width / 2, mouseY - height / 2);
    newVelocity.div(50);
    newVelocity.setMag(3);
    newVelocity.limit(3);
    this.vel.lerp(newVelocity, 0.2);

    const newX = this.pos.x + this.vel.x;
    const newY = this.pos.y + this.vel.y;
    if (newX >= BOARD_SIZE_X || newX <= -BOARD_SIZE_X ){
      this.vel.x = 0;
    }
    if (newY >= BOARD_SIZE_Y || newY <= -BOARD_SIZE_Y){
      this.vel.y = 0;
    }
    this.pos.add(this.vel);
  }

  intersects(other) {
    var d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < this.size + other.size) {
      return true;
    } else {
      return false;
    }
  }

  reset() {
    this.size = 10;
    this.x = random(-BOARD_SIZE_X, BOARD_SIZE_X);
    this.y = random(-BOARD_SIZE_X, BOARD_SIZE_Y);
    return p;
  }

  eject() {
    if (this.size > 10){
      this.size = this.size - 5
    }
    ejectedMatterArray.push(new EjectedMatter(this.pos.add(this.r)))
  }
  canEat(food) {
    if (
      this.intersects(food) &&
      this.size * this.size * PI > food.size * food.size * PI + EATING_THRESHOLD
    ) {
      return true;
    } else {
      return false;
    }
  }

  eat(foods, i) {
    const food = foods[i];
    this.size = Math.sqrt(this.size * this.size + food.size * food.size);
    foods = [...foods.slice(0, i), new Food(), ...foods.slice(i + 1)];
    return foods;
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFoodSize() {
  return Math.random() * 20 + 10;
}

function randomColor() {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
}

function randomXCoord() {
  return randomIntFromInterval(-BOARD_SIZE_X, BOARD_SIZE_X);
}

function randomYCoord() {
  return randomIntFromInterval(-BOARD_SIZE_Y, BOARD_SIZE_Y);
}

function generateFoodNearPoint(point) {
  const offsetX = Math.random() >= 0.5 ? Math.random() * w : Math.random() * -w;
  const offsetY = Math.random() >= 0.5 ? Math.random() * h : Math.random() * -h;
  const x = point.x + offsetX;
  const y = point.y + offsetY;
  foodArray = [...foodArray, new Food(x, y)];
}

function generateFoodNearPlayer() {
  generateFoodNearPoint(player.pos);
}

function keyPressed(value) {
  if (value.keyCode === 32) {
    player.stop = !player.stop;
  }
}

let board;

function setup() {
  foodArray = Array(1000)
    .fill(undefined)
    .map(item => {
      return new Food();
    });
  players = []
  player = new Player(100, 50, 30, "fufu", 60);
  items = [...players, ...foodArray];
  socket = io.connect("http://localhost:3000");
  board = new Board()
  createCanvas(w, h);
}

let zoomFactor = 1;

class Board {
  constructor() {
    this.x = -BOARD_SIZE_X
    this.y = -BOARD_SIZE_Y
    this.sizeX = 2*BOARD_SIZE_X
    this.sizeY = 2*BOARD_SIZE_Y
  }
 
  show() {
    fill(255)
    stroke(0);
    rect(this.x, this.y, this.sizeX, this.sizeY);
  };
}

function draw() {
  background(100);
  translate(width / 2, height / 2);
  const zoomOut = 70 / player.size;
  if (zoomOut < zoomFactor) {
    zoomFactor -= 0.001;
  }

  scale(zoomFactor)
  translate(-player.pos.x, -player.pos.y);
  board.show();

  player.update();
  for (let i = 0; i < foodArray.length; i += 1) {
    let food = foodArray[i];
    food.show();
    if (player.canEat(food)) {
      foodArray = player.eat(foodArray, i);
    }
  }
  player.show();
  const data = { x: player.pos.x, y: player.pos.y, size: player.size };
  socket.emit("updateState", data);
}

// TODO: Multiplayer Integration
// TODO: Blobs spalten mechanics
// TODO: fluid zoom out 
// TODO: green spiky things 
// TODO: decay rate - increases when getting bigger
// TODO: eject out mass particles 
// TODO: speed needs to be related to player size 



 //const playerIds = players.map(singlePlayer => singlePlayer.id)
  // socket.on("updateState", (data)=> {
  //   let playerGG = []
  //   data.players.forEach(player => {
  //     playerGG.push(
  //       new Player(player.x, player.y, player.size, player.playerName)
  //     )
  //   })

  //   players = playerGG
  //   items = [...players, ...foodArray];

    

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
