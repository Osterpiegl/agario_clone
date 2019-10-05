// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

function preload() {}
let m = 0;

class Dot {
  constructor(x, y, size, color = "#bbb") {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw() {
    const c = color(this.color);
    fill(c);
    ellipse(this.x, this.y, this.size, this.size);
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

const p1 = new Player(50, 50, 30, "p1", "#bbb");
const p2 = new Player(100, 50, 30, "p2", "#fff");

function setup() {
  createCanvas(600, 400);
  background(155);
}

function draw() {
  background(100);
  p1.updatePos(m, p1.y);
  m = m + 1;
  p1.draw();
  p2.draw();
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
