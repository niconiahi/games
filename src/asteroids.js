import { assert } from "./assert.js";
/**
 * @type {HTMLCanvasElement | null}
 */
const canvas = document.querySelector("#asteroids");
assert(canvas, "game canvas should be present");
const ROTATION_SPEED = 7;
const context = canvas.getContext("2d");
assert(context, "game canvas should have a 2d context");
const pixel_ratio = globalThis.devicePixelRatio;
const WIDTH = 200;
const HEIGHT = 200;
canvas.width = WIDTH * pixel_ratio;
canvas.height = HEIGHT * pixel_ratio;
context.scale(pixel_ratio, pixel_ratio);
function render() {
  assert(context, "game canvas should have a 2d context");
  assert(canvas, "game canvas should be present");
  context.clearRect(0, 0, canvas.width, canvas.height);
  draw_ship();
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
console.log("pixel_ratio", pixel_ratio);
const SHIP_WIDTH = 10;
const SHIP_HEIGHT = 20;
const ship = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  rotation: 0,
};
function draw_ship() {
  assert(context, "game canvas should have a 2d context");
  context.save();
  context.strokeStyle = "black";
  context.lineWidth = 1;
  console.log("draw_ship => ship.rotation", ship.rotation);
  context.translate(ship.x, ship.y);
  context.rotate(to_radians(ship.rotation));
  context.beginPath();
  context.moveTo(-SHIP_WIDTH / 2, SHIP_HEIGHT / 2);
  context.lineTo(0, -SHIP_HEIGHT / 2);
  context.lineTo(SHIP_WIDTH / 2, SHIP_HEIGHT / 2);
  context.closePath();
  context.fill();
  context.restore();
}
/**
 * @param {number} degrees
 */
function to_radians(degrees) {
  return degrees * (Math.PI / 180);
}
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft": {
      console.log("ship.rotation", ship.rotation);
      ship.rotation -= ROTATION_SPEED;
      break;
    }
    case "ArrowRight": {
      console.log("ship.rotation", ship.rotation);
      ship.rotation += ROTATION_SPEED;
      break;
    }
  }
});
