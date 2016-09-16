'use strict';
const baseSum = require('./_baseSum');

/** Used as references for various `Number` constants. */
const NAN = 0 / 0;

/**
 * The base implementation of `_.mean` and `_.meanBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the mean.
 */
function baseMean(array, iteratee) {
  const length = array ? array.length : 0;
  return length ? (baseSum(array, iteratee) / length) : NAN;
}

module.exports = baseMean;
