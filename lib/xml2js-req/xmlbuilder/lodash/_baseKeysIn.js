'use strict';
const Reflect = require('./_Reflect');
 const iteratorToArray = require('./_iteratorToArray');

/** Used for built-in method references. */
const objectProto = Object.prototype;

/** Built-in value references. */
const enumerate = Reflect ? Reflect.enumerate : undefined;
 const propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.keysIn` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  object = (object === null || object === undefined) ? object : Object(object);

  const result = [];
  for (const key in object) {
    result.push(key);
  }
  return result;
}

// Fallback for IE < 9 with es6-shim.
if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
  baseKeysIn = function(object) {
    return iteratorToArray(enumerate(object));
  };
}

module.exports = baseKeysIn;
