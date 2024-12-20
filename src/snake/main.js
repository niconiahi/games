/**
 * @template T
 * @param {T|null|undefined} value The value to check
 * @param {string} message Error message if assertion fails
 * @returns {asserts value is T} Asserts that value is not null or undefined
 * @throws {Error} If assertion fails
 */
function assert(value, message) {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}
/**
 * @typedef {[number, number]} Coordinate
 */

const COLUMN_COUNT = 20;
const ROW_COUNT = 20;
const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
/**
 * @type {HTMLCanvasElement | null}
 */
const canvas = document.querySelector("#game");
assert(canvas, "game canvas should be present");
canvas.width = COLUMN_COUNT * CELL_WIDTH + 1;
canvas.height = ROW_COUNT * CELL_HEIGHT + 1;
const context = canvas.getContext("2d");
assert(context, "game should have a 2d context");
/**
 * @type {Array.<Coordinate>}
 */
let snake = [[10, 10], [11, 10]];
let direction = "right";
/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 */
function render(canvas, context) {
  for (let x = 0; x < ROW_COUNT; x++) {
    for (let y = 0; y < COLUMN_COUNT; y++) {
      draw_board(context, x, y);
      draw_snake(context);
    }
  }
  requestAnimationFrame(() => render(canvas, context));
}
requestAnimationFrame(() => render(canvas, context));
/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 */
function draw_board(context, x, y) {
  const position_x = x * CELL_WIDTH;
  const position_y = y * CELL_HEIGHT;
  context.strokeStyle = "black";
  context.strokeRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
}
/**
 * @param {CanvasRenderingContext2D} context
 */
function draw_snake(context) {
  for (let x = 0; x < snake.length; x++) {
    const position_x = (snake[x][0] * CELL_WIDTH) - 1 * CELL_WIDTH;
    const position_y = (snake[x][1] * CELL_HEIGHT) - 1 * CELL_HEIGHT;
    context.fillStyle = "green";
    context.fillRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
  }
}
const button = document.querySelector("#advance");
assert(button, "button should existj0");
button.addEventListener("click", () => {
  // for (let x = 0; x < body.length; x++) {
  //   const position_x = (body[x][0] * CELL_WIDTH) - 1 * CELL_WIDTH;
  //   const position_y = (body[x][1] * CELL_HEIGHT) - 1 * CELL_HEIGHT;
  //   body.shift();
  //   context.clearRect(position_x, position_y, canvas.width, canvas.height);
  // }
  switch (direction) {
    case "right": {
      const tail = getTail(snake);
      let tail_x = tail[0];
      console.log("tail_x", tail_x);
      if (tail_x > COLUMN_COUNT) {
        tail_x = 0;
      }
      const tail_y = tail[1];
      console.log("tail_y", tail_y);
      const position_tail_x = (tail_x * CELL_WIDTH) - 1 * CELL_WIDTH;
      const position_tail_y = (tail_y * CELL_HEIGHT) - 1 * CELL_HEIGHT;
      context.clearRect(
        position_tail_x,
        position_tail_y,
        canvas.width,
        canvas.height,
      );
      snake.shift();

      const head = getHead(snake);
      let head_x = head[0];
      if (head_x >= COLUMN_COUNT) {
        head_x = 0;
      }
      const head_y = head[1];
      const position_head_x = (head_x * CELL_WIDTH) - 1 * CELL_WIDTH;
      const position_head_y = (head_y * CELL_HEIGHT) - 1 * CELL_HEIGHT;
      context.fillStyle = "green";
      context.fillRect(
        position_head_x,
        position_head_y,
        CELL_WIDTH,
        CELL_HEIGHT,
      );
      snake.push([head_x + 1, head_y]);
    }
  }
});

/**
 * @param {Array.<Coordinate>} snake
 */
function getHead(snake) {
  return snake[snake.length - 1];
}

/**
 * @param {Array.<Coordinate>} snake
 */
function getTail(snake) {
  return snake[0];
}
