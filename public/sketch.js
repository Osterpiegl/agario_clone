// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

function preload() {}
const vel = 3;

class Dot {
  constructor(x, y, size, c = "123") {
    this.pos = createVector(x, y);
    this.r = size/2;
    this.color = c;
  }

  changeColor() {
    this.color = color(random(255), random(255), random(255));
  }

  show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  intersects(other) {
    var d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < this.size / 2 + other.size / 2) {
      // console.log("INTER");
      return true;
    } else {
      return false;
    }
  }
}

class Player extends Dot {
  constructor(x = 1, y = 1, size = 10, name = "", color = "#123") {
    super(x, y, size, color);
    this.vel = createVector(0, 0);
    this.name = name;
  }

  update() {
    const newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.div(50);
    newvel.setMag(3);
    newvel.limit(3);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
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

let dots, players;

function setup() {
  dots = Array(15)
  .fill(undefined)
  .map(item => {
    return generateRandomDot();
  });
  players = [
    new Player(50, 50, 30, "p1", 255),
    new Player(100, 50, 30, "p2", 123)
  ];  
  createCanvas(600, 400);
  background(155);
}

function draw() {
  background(100);
  translate(width / 2, height / 2);
  translate(-players[0].pos.x, -players[0].pos.y);
  players[0].update();
  for (let i = 0; i < players.length; i += 1) {
    players[i].show();
    for (let j = 0; j < players.length; j += 1) {
      if (i != j && players[i].intersects(players[j])) {
        players[i].changeColor();
        players[j].changeColor();
      }
    }
  }
  
  dots.forEach(dot => dot.show());
}
