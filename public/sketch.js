// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

function preload() {}
let m = 0;

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
    if (d < this.size / 2 + other.r / 2) {
      return true;
    } else {
      return false;
    }
  }
}

class Player extends Dot {
  constructor(x = 1, y = 1, size = 10, name = "", color = "#123") {
    super(x, y, size, color);
    this.name = name;
  }

  updatePos(x, y) {
    super.x = x;
    super.y = y;
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

  for (let i = 0; i < players.length; i += 1) {
    players[i].draw();
    for (let j = 0; j < players.length; j += 1) {
      if (i != j && players[i].intersects(players[j])) {
        players[i].changeColor();
        players[j].changeColor();
      }
    }
  }
  players[0].updatePos(m, players[0].y);
  m = m + 1;
  dots.forEach(dot => dot.draw());
}

function keyPressed() {
  let keyIndex = -1;
  console.log(key);
  if (key >= "a" && key <= "z") {
    keyIndex = key.charCodeAt(0) - "a".charCodeAt(0);
  }
  if (keyIndex === -1) {
    // If it's not a letter key, clear the screen
    background(230);
  } else {
    // It's a letter key, fill a rectangle
    randFill_r = Math.floor(Math.random() * 255 + 1);
    randFill_g = Math.floor(Math.random() * 255 + 1);
    randFill_b = Math.floor(Math.random() * 255 + 1);
    fill(randFill_r, randFill_g, randFill_b);
    let x = map(keyIndex, 0, 25, 0, width - rectWidth);
    rect(x, 0, rectWidth, height);
  }
}
