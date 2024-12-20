/**
 * @typedef {[number, number]} Coordinate
 */
/**
 * @typedef {'right'|'left'|'up'|'down'} Direction
 */
/**
 * @type {Array.<Coordinate>}
 */
const snake = [[10, 10], [11, 10]];
/**
 * @type {Direction}
 */
const direction = "left";
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
const COLUMN_COUNT = 20;
const ROW_COUNT = 20;
const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const MOVE_INTERVAL = 500;
/**
 * @type {HTMLCanvasElement | null}
 */
const canvas = document.querySelector("#game");
assert(canvas, "game canvas should be present");
canvas.width = COLUMN_COUNT * CELL_WIDTH + 1;
canvas.height = ROW_COUNT * CELL_HEIGHT + 1;
const context = canvas.getContext("2d");
assert(context, "game canvas should have a 2d context");
let last_move_time = 0;
/**
 * @param {number} x
 * @param {number} y
 */
function draw_board(x, y) {
  assert(context, "game canvas should have a 2d context");
  const position_x = x * CELL_WIDTH;
  const position_y = y * CELL_HEIGHT;
  context.strokeStyle = "black";
  context.strokeRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
}
function draw_snake() {
  assert(context, "game canvas should have a 2d context");
  for (let x = 0; x < snake.length; x++) {
    const position_x = (snake[x][0] * CELL_WIDTH) - 1 * CELL_WIDTH;
    const position_y = (snake[x][1] * CELL_HEIGHT) - 1 * CELL_HEIGHT;
    context.fillStyle = "green";
    context.fillRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
  }
}
function move_snake() {
  assert(canvas, "game canvas should be present");
  assert(context, "game canvas should have a 2d context");
  switch (direction) {
    case "right": {
      const [tail_x, tail_y] = getTail(snake);
      const position_tail_x = (tail_x * CELL_WIDTH) - 1 * CELL_WIDTH;
      const position_tail_y = (tail_y * CELL_HEIGHT) - 1 * CELL_HEIGHT;
      context.clearRect(
        position_tail_x,
        position_tail_y,
        canvas.width,
        canvas.height,
      );
      snake.shift();

      let [head_x, head_y] = getHead(snake);
      if (head_x >= COLUMN_COUNT) {
        head_x = 0;
      }
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
      break;
    }
    case "left": {
      const [head_x, head_y] = getHead(snake);
      const position_head_x = (head_x * CELL_WIDTH) - 1 * CELL_WIDTH;
      const position_head_y = (head_y * CELL_HEIGHT) - 1 * CELL_HEIGHT;
      context.clearRect(
        position_head_x,
        position_head_y,
        canvas.width,
        canvas.height,
      );
      snake.pop();

      let [tail_x, tail_y] = getTail(snake);
      if (tail_x < 0) {
        tail_x = COLUMN_COUNT;
      }
      const position_tail_x = (tail_x * CELL_WIDTH) - 1 * CELL_WIDTH;
      const position_tail_y = (tail_y * CELL_HEIGHT) - 1 * CELL_HEIGHT;
      context.fillStyle = "green";
      context.fillRect(
        position_tail_x,
        position_tail_y,
        CELL_WIDTH,
        CELL_HEIGHT,
      );
      snake.unshift([tail_x - 1, tail_y]);

      break;
    }
  }
}

/**
 * @param {Array.<Coordinate>} snake
 * @returns {Coordinate} The coordinate of the snake's head
 */
function getHead(snake) {
  return snake[snake.length - 1];
}

/**
 * @param {Array.<Coordinate>} snake
 * @returns {Coordinate} The coordinate of the snake's tail
 */
function getTail(snake) {
  return snake[0];
}
/**
 * @param {number} timestamp
 */
function render(timestamp) {
  assert(context, "game canvas should be present");
  assert(context, "game canvas should have a 2d context");
  if (!last_move_time) {
    last_move_time = timestamp;
  }
  const elapsed_time = timestamp - last_move_time;
  if (elapsed_time > MOVE_INTERVAL) {
    last_move_time = timestamp;
    move_snake();
  }
  for (let x = 0; x < ROW_COUNT; x++) {
    for (let y = 0; y < COLUMN_COUNT; y++) {
      draw_board(x, y);
      draw_snake();
    }
  }
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
