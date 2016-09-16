'use strict';
const arrayAggregator = require('./_arrayAggregator');
 const baseAggregator = require('./_baseAggregator');
 const baseIteratee = require('./_baseIteratee');
 const isArray = require('./isArray');

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    const func = isArray(collection) ? arrayAggregator : baseAggregator;
 const accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee), accumulator);
  };
}

module.exports = createAggregator;
