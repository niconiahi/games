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
 * @type {HTMLCanvasElement | null}
 */
const game = document.querySelector("#game");
assert(game, "game canvas should be present");
const context = game.getContext("2d");
assert(context, "game should have a 2d context");
const CELLS_X_COUNT = 20;
const CELLS_Y_COUNT = 20;
const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
game.width = CELLS_X_COUNT * CELL_WIDTH + 1;
game.height = CELLS_Y_COUNT * CELL_HEIGHT + 1;
for (let x = 0; x < CELLS_Y_COUNT; x++) {
  for (let y = 0; y < CELLS_X_COUNT; y++) {
    const position_x = x * CELL_WIDTH + 0.5;
    const position_y = y * CELL_HEIGHT + 0.5;
    context.strokeStyle = "black";
    context.strokeRect(position_x, position_y, CELL_WIDTH, CELL_HEIGHT);
  }
}
