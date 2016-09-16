'use strict';
const Set = require('./_Set');
 const noop = require('./noop');
 const setToArray = require('./_setToArray');

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0;

/**
 * Creates a set of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
const createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;
