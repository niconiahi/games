<script>
import { assert } from "$lib/assert";
/**
 * @typedef {[number, number]} Coordinate
 */
/**
 * @typedef {Set.<Coordinate>} Snake
 */
/**
 * @type {Snake}
 */
let snake = new Set([
  [11, 10],
  [10, 10],
]);
/**
 * @typedef {Set.<Coordinate>} Fruits
 */
/**
 * @type {Fruits}
 */
let fruits = new Set([
  [3, 10],
  [2, 10],
  [4, 10],
]);
/**
 * @typedef {'right'|'left'|'up'|'down'} Direction
 */
/**
 * @type {Direction}
 */
let direction = "left";
const COLUMN_COUNT = 20;
const ROW_COUNT = 20;
const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const MOVE_INTERVAL = 300;
const FRUIT_INTERVAL = 3000;
let last_move_time = 0;
let last_fruit_time = 0;
$effect(() => {
  /**
   * @type {HTMLCanvasElement | null}
   */
  const canvas = document.querySelector("#snake");
  assert(canvas, "game canvas should be present");
  canvas.width = COLUMN_COUNT * CELL_WIDTH + 1;
  canvas.height = ROW_COUNT * CELL_HEIGHT + 1;
  const context = canvas.getContext("2d");
  assert(context, "game canvas should have a 2d context");
  /**
   * @param {number} timestamp
   */
  function render(timestamp) {
    assert(canvas, "game canvas should be present");
    assert(context, "game canvas should have a 2d context");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!last_move_time) {
      last_move_time = timestamp;
    }
    for (let x = 0; x < ROW_COUNT; x++) {
      for (let y = 0; y < COLUMN_COUNT; y++) {
        draw_board(context, x, y);
      }
    }
    (() => {
      const elapsed_time = timestamp - last_move_time;
      if (elapsed_time > MOVE_INTERVAL) {
        last_move_time = timestamp;
        move_snake(context);
      }
    })();
    (() => {
      const elapsed_time = timestamp - last_fruit_time;
      if (elapsed_time > FRUIT_INTERVAL) {
        last_fruit_time = timestamp;
        place_fruit();
      }
    })();
    draw_snake(context);
    draw_fruits(context);
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
});
/**
 * @param {CanvasRenderingContext2D} context
 */
function draw_fruits(context) {
  for (const coordinate of fruits) {
    const [x, y] = coordinate;
    const position_x = get_position_x(x);
    const position_y = get_position_y(y);
    context.fillStyle = "orange";
    context.fillRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
  }
}
/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 */
function draw_board(context, x, y) {
  assert(context, "game canvas should have a 2d context");
  const position_x = x * CELL_WIDTH;
  const position_y = y * CELL_HEIGHT;
  context.strokeStyle = "lightgray";
  context.strokeRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
}
/**
 * @param {number} x
 */
function get_position_x(x) {
  return x * CELL_WIDTH - 1 * CELL_WIDTH;
}

/**
 * @param {number} y
 */
function get_position_y(y) {
  return y * CELL_HEIGHT - 1 * CELL_HEIGHT;
}
/**
 * @param {CanvasRenderingContext2D} context
 */
function draw_snake(context) {
  assert(context, "game canvas should have a 2d context");
  for (const coordinate of snake) {
    const head = get_head(snake);
    const [x, y] = coordinate;
    const position_x = get_position_x(x);
    const position_y = get_position_y(y);
    if (coordinate === head) {
      context.save();
      context.translate(position_x, position_y);
      context.beginPath();
      if (direction === "left") {
        context.moveTo(CELL_WIDTH, 0);
        context.lineTo(0, CELL_HEIGHT / 2);
        context.lineTo(CELL_WIDTH, CELL_HEIGHT);
      }
      if (direction === "right") {
        context.moveTo(0, 0);
        context.lineTo(CELL_WIDTH, CELL_HEIGHT / 2);
        context.lineTo(0, CELL_HEIGHT);
      }
      if (direction === "up") {
        context.moveTo(0, CELL_HEIGHT);
        context.lineTo(CELL_WIDTH / 2, 0);
        context.lineTo(CELL_WIDTH, CELL_HEIGHT);
      }
      if (direction === "down") {
        context.moveTo(0, 0);
        context.lineTo(CELL_WIDTH / 2, CELL_HEIGHT);
        context.lineTo(CELL_WIDTH, 0);
      }
      context.closePath();
      context.fillStyle = "green";
      context.fill();
      context.translate(-position_x, -position_y);
      context.restore();
      continue;
    }
    context.fillStyle = "green";
    context.fillRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
  }
}
/**
 * @param {number} min
 * @param {number} max
 */
function get_random_number(min, max) {
  return Math.floor(Math.random() * max) + min;
}
function get_free_coordinate() {
  const random_board_coordinate = get_random_board_coordinate();
  if (is_part_of_snake(snake, random_board_coordinate)) {
    return get_free_coordinate();
  }
  return random_board_coordinate;
}
function get_random_board_coordinate() {
  const x = get_random_number(1, COLUMN_COUNT);
  const y = get_random_number(1, ROW_COUNT);
  /**
   * @type {Coordinate}
   */
  const coordinate = [x, y];
  return coordinate;
}
function place_fruit() {
  const free_coordinate = get_free_coordinate();
  fruits.add(free_coordinate);
}
function reset_game() {
  snake = new Set([
    [11, 10],
    [10, 10],
  ]);
  fruits = new Set([
    [3, 10],
    [2, 10],
    [4, 10],
  ]);
  direction = "left";
  last_move_time = 0;
}
/**
 * @param {Coordinate} a
 * @param {Coordinate} b
 */
function do_coordinates_match(a, b) {
  if (a[0] === b[0] && a[1] === b[1]) {
    return true;
  }
  return false;
}
/**
 * @param {Fruits} fruits
 * @param {Coordinate} coordinate
 */
function does_snake_eat_fruit(fruits, coordinate) {
  for (const _coordinate of fruits) {
    if (do_coordinates_match(_coordinate, coordinate)) {
      return true;
    }
  }
  return false;
}
/**
 * @param {CanvasRenderingContext2D} context
 */
function move_snake(context) {
  assert(context, "game canvas should have a 2d context");
  const next_coordinate = get_next_coordinate(snake, direction);
  if (does_snake_collide(snake, next_coordinate)) {
    reset_game();
    return;
  }
  if (does_snake_eat_fruit(fruits, next_coordinate)) {
    const fruit = get_fruit(fruits, next_coordinate);
    fruits.delete(fruit);
  } else {
    const tail = get_tail(snake);
    snake.delete(tail);
  }
  snake.add(next_coordinate);
}
/**
 * @param {Snake} snake
 * @param {Coordinate} coordinate
 * @returns {boolean} Whether the coordinate is part of the snake
 */
function is_part_of_snake(snake, coordinate) {
  for (const _coordinate of snake) {
    if (do_coordinates_match(coordinate, _coordinate)) {
      return true;
    }
  }
  return false;
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
 * @param {Fruits} fruits
 * @param {Coordinate} coordinate
 */
function get_fruit(fruits, coordinate) {
  /**
   * @type {Coordinate|undefined}
   */
  let fruit;
  for (const _coordinate of fruits) {
    if (do_coordinates_match(_coordinate, coordinate)) {
      fruit = _coordinate;
    }
  }
  assert(fruit, "the fruit should exist on the board");
  return fruit;
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
  for (const _coordinate of snake) {
    if (do_coordinates_match(coordinate, _coordinate)) {
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
</script>

<canvas id="snake"></canvas>
