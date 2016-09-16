'use strict';
const baseToPairs = require('./_baseToPairs');
 const getTag = require('./_getTag');
 const mapToArray = require('./_mapToArray');
 const setToPairs = require('./_setToPairs');

/** `Object#toString` result references. */
const mapTag = '[object Map]';
 const setTag = '[object Set]';

/**
 * Creates a `_.toPairs` or `_.toPairsIn` function.
 *
 * @private
 * @param {Function} keysFunc The function to get the keys of a given object.
 * @returns {Function} Returns the new pairs function.
 */
function createToPairs(keysFunc) {
  return function(object) {
    const tag = getTag(object);
    if (tag == mapTag) {
      return mapToArray(object);
    }
    if (tag == setTag) {
      return setToPairs(object);
    }
    return baseToPairs(object, keysFunc(object));
  };
}

module.exports = createToPairs;
