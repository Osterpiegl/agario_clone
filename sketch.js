p5.disableFriendlyErrors = true;
let w = window.innerWidth;
let h = window.innerHeight;
function preload() {}
let m = 0;

class Player {
  constructor(x = 1, y = 1, size = 10) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  updatePos(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
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
