let w = window.innerWidth;
let h = window.innerHeight;
function preload() {}
let m = 0;

class Player {
  constructor(x = 1, y = 1, size = 10, name = "", color = "#123") {
    this.x = x;
    this.y = y;
    this.size = size;
    this.name = name;
    this.color = color;
  }

  updatePos(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    let c = color(this.color);
    fill(c);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

const p1 = new Player(50, 50, 30);

function setup() {
  createCanvas(600, 400);
  background(155);
}

function draw() {
  background(100);
  p1.updatePos(1, m);
  m = m + 1;
  p1.draw();
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
