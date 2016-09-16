'use strict';
const get = require('./get');

/**
 * The base implementation of `_.at` without support for individual paths.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {string[]} paths The property paths of elements to pick.
 * @returns {Array} Returns the picked elements.
 */
function baseAt(object, paths) {
  let index = -1;
  const isNil = object === null;
       const length = paths.length;
 const result = Array(length);

  while (++index < length) {
    result[index] = isNil ? undefined : get(object, paths[index]);
  }
  return result;
}

module.exports = baseAt;
