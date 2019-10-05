// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

function preload() {}
const vel = 3;

class Dot {
  constructor(x, y, size, c = "123") {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = c;
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
      console.log("INTER");
      return true;
    } else {
      return false;
    }
  }
}

class Player extends Dot {
  constructor(x = 1, y = 1, size = 10, name = "", color = "#123") {
    super(x, y, size, color);
    this.xVel = 0;
    this.yVel = 0;
    this.name = name;
  }

  updatePos() {
    // if (mouseIsOutsidePlayer(this.x, this.y, this.size)) {
      console.log(mouseX, mouseY)
      const xDiff = mouseX-this.x
      const yDiff = mouseY-this.y
      const mag = Math.sqrt(xDiff*xDiff+yDiff*yDiff)
      this.xVel = xDiff / mag * vel
      this.yVel = yDiff / mag * vel
      this.x += this.xVel;
      this.y += this.yVel;
    // }
  }

  // draw() {
  //   let c = color(this.color);
  //   fill(c);
  //   ellipse(this.x, this.y, this.size, this.size);
  // }
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
  const distance = dist(mouseX, mouseY, x, y)
  console.log(distance)
  const radius = size/2
  if (distance > radius) {
    return true;
  }
  return false;
}

const dots = Array(15)
  .fill(undefined)
  .map(item => {
    return generateRandomDot();
  });

const players = [
  new Player(50, 50, 30, "p1", 255),
  new Player(100, 50, 30, "p2", 123)
];

function setup() {
  createCanvas(600, 400);
  background(155);
}

function draw() {
  background(100);
  translate(width / 2, height / 2);
  translate(-players[0].x, -players[0].y);
  players[0].updatePos(mouseX, mouseY);
  for (let i = 0; i < players.length; i += 1) {
    players[i].draw();
    for (let j = 0; j < players.length; j += 1) {
      if (i != j && players[i].intersects(players[j])) {
        players[i].changeColor();
        players[j].changeColor();
      }
    }
  }
  
  dots.forEach(dot => dot.draw());
}
