// let w = window.innerWidth;
// let h = window.innerHeight;
let w = 600;
let h = 400;

let socket;

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
    this.pos = createVector(x, y);
    this.size = size / 2;
    this.color = color;
  }

  changeColor() {
    this.color = color(random(255), random(255), random(255));
  }

  show = function() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
  };

  intersects(other) {
    var d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
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
    dot.pos = createVector(random(255), random(255));
    dot.color = color(random(255), random(255), random(255));
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

let dots, players, player, items;

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

function setup() {
  socket = io.connect("http://localhost:3000");
  dots = Array(15)
    .fill(undefined)
    .map(item => {
      return generateRandomDot();
    });
  players = [
    new Player(50, 50, 30, "p1", 255),
    new Player(100, 50, 30, "p2", 123)
  ];
  player = new Player(100, 50, 30, "fufu", 255);
  items = [...players, ...dots];

  createCanvas(600, 400);
  background(155);
}

function draw() {
  background(100);
  translate(width / 2, height / 2);
  translate(-player.pos.x, -player.pos.y);
  player.update();
  for (let i = 0; i < items.length; i += 1) {
    items[i].show();
    player.show();
    if (player.intersects(items[i])) {
      let canEat = player.canEat(items[i]);
      if (canEat) player.eat(items[i]);
    }
  }

  if (frameCount % 60 === 0) {
    console.log(player.pos.x);
    const data = { x: player.pos.x, y: player.pos.y, size: player.size };
    socket.emit("updateState", data);
  }
}
