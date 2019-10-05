let w = window.innerWidth;
let h = window.innerHeight;
function preload() {}
const vel = 0.1;

class Player {
  constructor(x = 1, y = 1, size = 10) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.xVel = 0;
    this.yVel = 0;
  }

  updatePos() {
    this.xVel = (mouseX-this.x)*vel
    this.yVel = (mouseY-this.y)*vel
    this.x += this.xVel;
    this.y += this.yVel;
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
  p1.updatePos();
  p1.draw();
}
