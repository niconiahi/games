/**
 * @typedef {[number, number]} Coordinate
 */
/**
 * @typedef {Set.<Coordinate>} Snake
 */
/**
 * @typedef {'right'|'left'|'up'|'down'} Direction
 */
/**
 * @type {Snake}
 */
// const snake = new Set([[10, 10], [11, 10]]);
const snake = new Set([[11, 10], [10, 10]]);
/**
 * @type {Direction}
 */
let direction = "left";
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
  for (const coordinate of snake) {
    const position_x = (coordinate[0] * CELL_WIDTH) - 1 * CELL_WIDTH;
    const position_y = (coordinate[1] * CELL_HEIGHT) - 1 * CELL_HEIGHT;
    context.fillStyle = "green";
    context.fillRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
  }
}
/**
 * @param {Coordinate} coordinate The coordinate to move to
 */
function move_snake(coordinate) {
  assert(canvas, "game canvas should be present");
  assert(context, "game canvas should have a 2d context");
  const tail = get_tail(snake);
  const [tail_x, tail_y] = tail;
  const position_tail_x = (tail_x * CELL_WIDTH) - 1 * CELL_WIDTH;
  const position_tail_y = (tail_y * CELL_HEIGHT) - 1 * CELL_HEIGHT;
  context.clearRect(
    position_tail_x,
    position_tail_y,
    canvas.width,
    canvas.height,
  );
  // TODO: if eats apple, doesn't shift
  snake.delete(tail);

  const [head_x, head_y] = get_head(snake);
  const position_head_x = (head_x * CELL_WIDTH) - 1 * CELL_WIDTH;
  const position_head_y = (head_y * CELL_HEIGHT) - 1 * CELL_HEIGHT;
  context.fillStyle = "green";
  context.fillRect(
    position_head_x,
    position_head_y,
    CELL_WIDTH,
    CELL_HEIGHT,
  );
  snake.add(coordinate);
}

/**
 * @param {Snake} snake
 * @returns {Coordinate} The coordinate of the snake's head
 */
function get_head(snake) {
  /**
   * @type {Coordinate|undefined}
   */
  let head;
  for (const coordinate of snake) {
    head = coordinate;
  }
  assert(head, "the tail of the snake should exist");
  return head;
}

/**
 * @param {Snake} snake
 * @returns {Coordinate} The coordinate of the snake's tail
 */
function get_tail(snake) {
  /**
   * @type {Coordinate|undefined}
   */
  const tail = snake.values().next().value;
  assert(tail, "the head of the snake should exist");
  return tail;
}

/**
 * @param {Snake} snake
 * @param {Coordinate} coordinate
 * @returns {boolean} A boolean representing if either the snake collides and dies or not
 */
function does_snake_collide(snake, coordinate) {
  for (const _coodinate of snake) {
    if (_coodinate === coordinate) {
      return true;
    }
  }
  return false;
}

/**
 * @param {Snake} snake
 * @param {Direction} direction
 * @returns {Coordinate} The coordinate of the snake's head
 */
function get_next_coordinate(snake, direction) {
  switch (direction) {
    case "right": {
      const [x, y] = get_head(snake);
      let next_x = x + 1;
      if (next_x > COLUMN_COUNT) {
        next_x = 1;
      }
      return [next_x, y];
    }
    case "left": {
      const [x, y] = get_head(snake);
      let next_x = x - 1;
      if (next_x < 1) {
        next_x = COLUMN_COUNT;
      }
      return [next_x, y];
    }
    case "up": {
      const [x, y] = get_head(snake);
      let next_y = y - 1;
      if (next_y < 1) {
        next_y = ROW_COUNT;
      }
      return [x, next_y];
    }
    case "down": {
      const [x, y] = get_head(snake);
      let next_y = y + 1;
      if (next_y > ROW_COUNT) {
        next_y = 1;
      }
      return [x, next_y];
    }
    default: {
      throw new Error("invalid direction");
    }
  }
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
    const next_coordinate = get_next_coordinate(snake, direction);
    if (does_snake_collide(snake, next_coordinate)) {
      // TODO: handle end of game
    }
    move_snake(next_coordinate);
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
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight": {
      if (direction === "left") {
        return;
      }
      direction = "right";
      break;
    }
    case "ArrowLeft": {
      if (direction === "right") {
        return;
      }
      direction = "left";
      break;
    }
    case "ArrowDown": {
      if (direction === "up") {
        return;
      }
      direction = "down";
      break;
    }
    case "ArrowUp": {
      if (direction === "down") {
        return;
      }
      direction = "up";
      break;
    }
  }
});
