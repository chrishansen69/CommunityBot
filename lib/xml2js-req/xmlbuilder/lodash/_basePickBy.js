'use strict';
const getAllKeysIn = require('./_getAllKeysIn');

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, predicate) {
  let index = -1;
 const props = getAllKeysIn(object);
       const length = props.length;
 const result = {};

  while (++index < length) {
    const key = props[index];
 const value = object[key];

    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
}

module.exports = basePickBy;
