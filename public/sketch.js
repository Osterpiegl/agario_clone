let w = window.innerWidth;
let h = window.innerHeight;
function preload() {}
const vel = 3;

class Player {
  constructor(x = 1, y = 1, size = 10, name = "", color = "#123") {
    this.x = x;
    this.y = y;
    this.size = size;
    this.xVel = 0;
    this.yVel = 0;
    this.name = name;
    this.color = color;
  }
  
  updatePos() {
    if (mouseIsOutsidePlayer(this.x, this.y, this.size)) {
      this.xVel = (mouseX-this.x)*vel
      this.yVel = (mouseY-this.y)*vel
      const mag = Math.sqrt(this.xVel*this.xVel+this.yVel*this.yVel)
      this.xVel = this.xVel / mag * vel
      this.yVel = this.yVel / mag * vel
      this.x += this.xVel;
      this.y += this.yVel;
    }
  }

  draw() {
    let c = color(this.color);
    fill(c);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function mouseIsOutsidePlayer(x, y, size) {
  const distance = dist(mouseX, mouseY, x, y)
  const radius = size/2
  if (distance > radius) {
    return true
  }
  return false
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

