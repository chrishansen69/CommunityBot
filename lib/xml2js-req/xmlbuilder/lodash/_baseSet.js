'use strict';
const assignValue = require('./_assignValue');
 const castPath = require('./_castPath');
 const isIndex = require('./_isIndex');
 const isKey = require('./_isKey');
 const isObject = require('./isObject');
 const toKey = require('./_toKey');

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  path = isKey(path, object) ? [path] : castPath(path);

  let index = -1;
       const length = path.length;
 const lastIndex = length - 1;
 let nested = object;

  while ((nested !== null && nested !== undefined) && ++index < length) {
    const key = toKey(path[index]);
    if (isObject(nested)) {
      let newValue = value;
      if (index != lastIndex) {
        const objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = (objValue === null || objValue === undefined)
            ? (isIndex(path[index + 1]) ? [] : {})
            : objValue;
        }
      }
      assignValue(nested, key, newValue);
    }
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;
