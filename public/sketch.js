// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

let socket;
let foodArray, players, player, items;

function preload() {}
const vel = 3;
const EATING_THRESHOLD = 5 * 5;
const DOT_BASE_SIZE = 5;
const PLAYER_BASE_SIZE = 12;
const SIZE = 2;
const BOARD_SIZE_Y = SIZE * h;
const BOARD_SIZE_X = SIZE * w;
const EJECTED_MATTER_SIZE = 5;

class Dot {
  constructor(
    x = 0,
    y = 0,
    r = DOT_BASE_SIZE,
    color = color(255, 255, 255),
    stroke = false
  ) {
    this.pos = createVector(x, y);
    this.r = r;
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
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

}

class Food extends Dot {
  constructor(x = randomXCoord(), y = randomYCoord()) {
    super(x, y, randomFoodSize(), randomColor(), false);
  }
}


class EjectedMatter extends Dot {
  constructor(x, y, vel, pos, direction) {
    super(x, y, EJECTED_MATTER_SIZE, color(0, 100, 50), false);
    this.velMag = 10;
    this.vel = vel//vel.copy();
    // this.vel.setMag(this.velMag)
    this.pos = pos;
    this.direction = direction;
    this.stop = false
  }

  draw() {
    drawArrow(this.pos, this.direction, 'red');
  }
  // speedDecay() {
  //   if (this.velMag > 0 && !this.stop){
  //     this.velMag = this.velMag - 0.2;
  //     this.vel.setMag(this.velMag)
  //   }
  //   else {
  //     this.stop = true
  //   }
  // }

  update() {
    if (!this.stop) {
    this.pos.add(this.vel)
    }
  }
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

class Player extends Dot {
  constructor(
    x = 1,
    y = 1,
    r = PLAYER_BASE_SIZE,
    name,
    color = color(random(255), random(255), random(255)),
    stop = false
  ) {
    super(x, y, r, color, true);
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

    const newX = this.pos.x + this.vel.x;
    const newY = this.pos.y + this.vel.y;
    if (newX >= BOARD_SIZE_X || newX <= -BOARD_SIZE_X) {
      this.vel.x = 0;
    }
    if (newY >= BOARD_SIZE_Y || newY <= -BOARD_SIZE_Y) {
      this.vel.y = 0;
    }
    this.pos.add(this.vel);

    const updateData = {
      x: this.pos.x,
      y: this.pos.y,
      r: this.r
    };
    socket.emit("updateState", updateData);
  }

  intersects(other) {
    var d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < this.r + other.r) {
      return true;
    } else {
      return false;
    }
  }

  reset() {
    this.r = 10;
    this.x = random(-BOARD_SIZE_X, BOARD_SIZE_X);
    this.y = random(-BOARD_SIZE_X, BOARD_SIZE_Y);
    return p;
  }

  ejectMatter() {
      if (this.r > 10){
      // this.r = Math.sqrt(this.r*this.r - EJECTED_MATTER_SIZE*EJECTED_MATTER_SIZE);
      const direction = createVector(mouseX, mouseY)

      // direction.normalize()
      // direction.mult(this.r)
      // direction.add(this.pos)
      ejectedMatterArray.push(new EjectedMatter(direction.x, direction.y, this.vel, this.pos, direction))
    }
  }

  canEat(food) {
    if (
      this.intersects(food) &&
      this.r * this.r * PI > food.r * food.r * PI + EATING_THRESHOLD
    ) {
      return true;
    } else {
      return false;
    }
  }

  eatEjectedMatter(ejectedMatterArray, i){
    const ejectedMatter = ejectedMatterArray[i];
    this.r = Math.sqrt(this.r * this.r + ejectedMatter.r * ejectedMatter.r);
    ejectedMatterArray = [...ejectedMatterArray.slice(0, i), ...ejectedMatterArray.slice(i + 1)];
    return ejectedMatterArray;
  }

  eatFood(foods, i) {
    const food = foods[i];
    this.r = Math.sqrt(this.r * this.r + food.r * food.r);
    foods = [...foods.slice(0, i), new Food(), ...foods.slice(i + 1)];
    return foods;
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFoodSize() {
  return Math.random() * DOT_BASE_SIZE;
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
      player.ejectMatter();
      // player.stop = !player.stop;
    }
}

let board;
let ejectedMatterArray = []

function setup() {
  foodArray = Array(1000)
    .fill(undefined)
    .map(item => {
      return new Food();
    });
  players = [];
  player = new Player(100, 50, 30, "fufu", 60);
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
  board = new Board();
  createCanvas(w, h);
}

let zoomFactor = 1;

class Board {
  constructor() {
    this.x = -BOARD_SIZE_X;
    this.y = -BOARD_SIZE_Y;
    this.sizeX = 2 * BOARD_SIZE_X;
    this.sizeY = 2 * BOARD_SIZE_Y;
  }

  show() {
    fill(255);
    stroke(0);
    rect(this.x, this.y, this.sizeX, this.sizeY);
  }
}

function draw() {
  background(100);
  translate(width / 2, height / 2);
  const zoomOut = 70 / player.r;
  if (zoomOut < zoomFactor) {
    zoomFactor -= 0.001;
  }
  scale(zoomFactor);
  translate(-player.pos.x, -player.pos.y);
  board.show();

  // player.update();
  for (let i = 0; i < foodArray.length; i += 1) {
    let food = foodArray[i];
    food.show();
    if (player.canEat(food)) {
      foodArray = player.eatFood(foodArray, i);
    }
  }

  
  players.forEach(player => player.show());
  player.show();
  for (let i = 0; i < ejectedMatterArray.length; i += 1) {
    let ejectedMatter = ejectedMatterArray[i];
    ejectedMatter.update();
    // ejectedMatter.speedDecay();
    
    ejectedMatter.draw();
    // if (player.canEat(ejectedMatter)) {
    //   ejectedMatterArray = player.eatEjectedMatter(ejectedMatterArray, i);
    // }
  }
}

// TODO: Multiplayer Integration
// TODO: Blobs spalten mechanics
// TODO: fluid zoom out
// TODO: green spiky things
// TODO: decay rate - increases when getting bigger
// TODO: eject out mass particles
// TODO: speed needs to be related to player r

//const playerIds = players.map(singlePlayer => singlePlayer.id)
// socket.on("updateState", (data)=> {
//   let playerGG = []
//   data.players.forEach(player => {
//     playerGG.push(
//       new Player(player.x, player.y, player.r, player.playerName)
//     )
//   })

//   players = playerGG
//   items = [...players, ...foodArray];

// const {players: serverPlayers} = data
// serverPlayers.forEach(player => {
//   if (playerIds.includes(player.id)) {
//     players[player.id].x = player.x;
//     players[player.id].y = player.y;
//     players[player.id].r = player.r;
//   } else {

//   }
// }
// serverPlayers.forEach(player => { if (players[id] === players.id){

// }})
// console.log(serverPlayers); })
