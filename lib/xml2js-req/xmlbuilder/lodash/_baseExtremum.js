'use strict';
const isSymbol = require('./isSymbol');

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  let index = -1;
       const length = array.length;
  let computed; let result;

  while (++index < length) {
    const value = array[index];
 const current = iteratee(value);

    if (current && (computed === undefined ?
      (current === current && !isSymbol(current)) :
      comparator(current, computed)
        )) {
      computed = current;
          result = value;
    }
  }
  return result;
}

module.exports = baseExtremum;
