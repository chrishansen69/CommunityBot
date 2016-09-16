'use strict';
const Stack = require('./_Stack');
 const baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
const UNORDERED_COMPARE_FLAG = 1;
 const PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  let index = matchData.length;
       const length = index;
 const noCustomizer = !customizer;
 let data;

  if ((object === null || object === undefined)) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    data = matchData[index];
    if ((noCustomizer && data[2]) ? data[1] !== object[data[0]] : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    const key = data[0];
 const objValue = object[key];
 const srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      const stack = new Stack();
      let result;
      if (customizer) {
        result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;
