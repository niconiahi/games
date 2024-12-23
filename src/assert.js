/**
 * @template T
 * @param {T|null|undefined} value The value to check
 * @param {string} message Error message if assertion fails
 * @returns {asserts value is T} Asserts that value is not null or undefined
 * @throws {Error} If assertion fails
 */
export function assert(value, message) {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}
