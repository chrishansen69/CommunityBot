'use strict';
const arrayMap = require('./_arrayMap');
 const baseAt = require('./_baseAt');
 const baseFlatten = require('./_baseFlatten');
 const basePullAt = require('./_basePullAt');
 const compareAscending = require('./_compareAscending');
 const isIndex = require('./_isIndex');
 const rest = require('./rest');

/**
 * Removes elements from `array` corresponding to `indexes` and returns an
 * array of removed elements.
 *
 * **Note:** Unlike `_.at`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...(number|number[])} [indexes] The indexes of elements to remove.
 * @returns {Array} Returns the new array of removed elements.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 * var pulled = _.pullAt(array, [1, 3]);
 *
 * console.log(array);
 * // => ['a', 'c']
 *
 * console.log(pulled);
 * // => ['b', 'd']
 */
const pullAt = rest(function(array, indexes) {
  indexes = baseFlatten(indexes, 1);

  const length = array ? array.length : 0;
 const result = baseAt(array, indexes);

  basePullAt(array, arrayMap(indexes, function(index) {
    return isIndex(index, length) ? +index : index;
  }).sort(compareAscending));

  return result;
});

module.exports = pullAt;
