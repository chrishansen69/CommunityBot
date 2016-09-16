'use strict';
const arrayPush = require('./_arrayPush');
 const baseFlatten = require('./_baseFlatten');
 const copyArray = require('./_copyArray');
 const isArray = require('./isArray');

/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
  const length = arguments.length;
 const args = Array(length ? length - 1 : 0);
 const array = arguments[0];
 let index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }
  return length
    ? arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1))
    : [];
}

module.exports = concat;
