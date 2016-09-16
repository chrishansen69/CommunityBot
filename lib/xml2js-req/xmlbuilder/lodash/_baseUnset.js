'use strict';
const baseHas = require('./_baseHas');
 const castPath = require('./_castPath');
 const isKey = require('./_isKey');
 const last = require('./last');
 const parent = require('./_parent');
 const toKey = require('./_toKey');

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);
  object = parent(object, path);

  const key = toKey(last(path));
  return !((object !== null && object !== undefined) && baseHas(object, key)) || delete object[key];
}

module.exports = baseUnset;
