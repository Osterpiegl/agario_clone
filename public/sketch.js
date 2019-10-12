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
    color = color(255, 255, 255),
    stroke = false
  ) {
    this.pos = createVector(x, y);
    this.size = size / 2;
    this.color = color;
    this.stroke = stroke;
  }
  show() {
    fill(this.color);
    strokeWeight(0);
    if (this.stroke) {
      strokeWeight(5);
      stroke("#f542bc");
    }
    ellipse(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
  }
}

class Food extends Dot {
  constructor(x = randomXCoord(), y = randomYCoord()) {
    super(x, y, randomFoodSize(), randomColor(), false);
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
    super(x, y, size, color, true);
    this.stop = stop;
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
    this.pos.add(this.vel);

    const updateData = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.size
    };
    socket.emit("updateState", updateData);
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
    this.x = random(w);
    this.y = random(h);
    return p;
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

function setup() {
  foodArray = Array(1000)
    .fill(undefined)
    .map(item => {
      return new Food();
    });
  players = [];
  player = new Player(100, 50, 30, "fufu", 255);
  items = [...players, ...foodArray];
  socket = io.connect("http://localhost:3000");

  socket.on("updateState", data => {
    players = data.players.map(
      player =>
        new Player(
          player.x,
          player.y,
          player.r,
          player.playerName,
          player.color,
          false
        )
    );
  });

  createCanvas(600, 400);
  background(155);
}

let zoomFactor = 1;

function draw() {
  background(100);
  translate(width / 2, height / 2);
  const zoomOut = 70 / player.size;
  if (zoomOut < zoomFactor) {
    zoomFactor -= 0.001;
  }
  scale(zoomFactor);
  translate(-player.pos.x, -player.pos.y);
  player.update();
  for (let i = 0; i < foodArray.length; i += 1) {
    let food = foodArray[i];
    food.show();
    if (player.canEat(food)) {
      foodArray = player.eat(foodArray, i);
    }
  }
  players.forEach(player => player.show());
  player.show();
}

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
