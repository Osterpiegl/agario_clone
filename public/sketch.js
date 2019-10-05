// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

function preload() {}
const vel = 3;
const EATING_THRESH_HOLD = 5;
const DOT_BASE_SIZE = 10;
const PLAYER_BASE_SIZE = 30;

class Dot {
  constructor(
    x,
    y,
    size = DOT_BASE_SIZE,
    color = color(random(255), random(255), random(255))
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw() {
    fill(color(this.color));
    ellipse(this.x, this.y, this.size, this.size);
  }

  changeColor() {
    this.color = color(random(255), random(255), random(255));
  }

  intersects(other) {
    var d = dist(this.x, this.y, other.x, other.y);
    if (d < this.size / 2 + other.size / 2) {
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
    this.xVel = 0;
    this.yVel = 0;
    this.name = name;
  }

  updatePos() {
    if (mouseIsOutsidePlayer(this.x, this.y, this.size)) {
      this.xVel = (mouseX - this.x) * vel;
      this.yVel = (mouseY - this.y) * vel;
      const mag = Math.sqrt(this.xVel * this.xVel + this.yVel * this.yVel);
      this.xVel = (this.xVel / mag) * vel;
      this.yVel = (this.yVel / mag) * vel;
      this.x += this.xVel;
      this.y += this.yVel;
    }
  }

  canEat(dot) {
    if (this.size - EATING_THRESH_HOLD > dot.size) {
      return true;
    } else {
      return false;
    }
  }

  eat(dot) {
    if (dot.constructor.name === "Player") {
      this.size = this.size + dot.size;
      dot.size = PLAYER_BASE_SIZE;
    } else {
      this.size = this.size + 1;
      dot.size = DOT_BASE_SIZE;
    }
    dot.x = random(w);
    dot.y = random(h);
    dot.color = random(255);
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

function mouseIsOutsidePlayer(x, y, size) {
  const distance = dist(mouseX, mouseY, x, y);
  const radius = size / 2;
  if (distance > radius) {
    return true;
  }
  return false;
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

const dots = Array(5)
  .fill(undefined)
  .map(item => {
    return generateRandomDot();
  });

const players = [
  new Player(50, 50, 50, "p1", 255),
  new Player(100, 50, 30, "p2", 255)
];

function setup() {
  createCanvas(600, 400);
  background(155);
}

const player = new Player(100, 50, 30, "fufu", 255);

const items = [...players, ...dots];

function draw() {
  background(100);
  for (let i = 0; i < items.length; i += 1) {
    items[i].draw();
    player.draw();
    if (player.intersects(items[i])) {
      let canEat = player.canEat(items[i]);
      if (canEat) player.eat(items[i]);
    }
  }

  player.updatePos(player.y);
}
