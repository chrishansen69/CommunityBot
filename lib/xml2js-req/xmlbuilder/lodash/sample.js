'use strict';
const baseRandom = require('./_baseRandom');
 const isArrayLike = require('./isArrayLike');
 const values = require('./values');

/**
 * Gets a random element from `collection`.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 */
function sample(collection) {
  const array = isArrayLike(collection) ? collection : values(collection);
       const length = array.length;

  return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
}

module.exports = sample;
