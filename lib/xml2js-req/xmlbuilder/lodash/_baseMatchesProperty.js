'use strict';
const baseIsEqual = require('./_baseIsEqual');
 const get = require('./get');
 const hasIn = require('./hasIn');
 const isKey = require('./_isKey');
 const isStrictComparable = require('./_isStrictComparable');
 const matchesStrictComparable = require('./_matchesStrictComparable');
 const toKey = require('./_toKey');

/** Used to compose bitmasks for comparison styles. */
const UNORDERED_COMPARE_FLAG = 1;
 const PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    const objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

module.exports = baseMatchesProperty;
