p5.disableFriendlyErrors = true;
let w = window.innerWidth;
let h = window.innerHeight;
function preload() {
}
function setup() {
}
function draw() {
}
function keyPressed() {
    let keyIndex = -1;
    console.log(key)
    if (key >= 'a' && key <= 'z') {
      keyIndex = key.charCodeAt(0) - 'a'.charCodeAt(0);
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
  
