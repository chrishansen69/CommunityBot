'use strict';
const keys = require('./keys');

/**
 * The base implementation of `_.conforms` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property predicates to conform to.
 * @returns {Function} Returns the new spec function.
 */
function baseConforms(source) {
  const props = keys(source);
       const length = props.length;

  return function(object) {
    if (!object) {
      return !length;
    }
    let index = length;
    while (index--) {
      const key = props[index];
 const predicate = source[key];
 const value = object[key];

      if ((value === undefined &&
          !(key in Object(object))) || !predicate(value)) {
        return false;
      }
    }
    return true;
  };
}

module.exports = baseConforms;
