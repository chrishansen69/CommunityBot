'use strict';
const castPath = require('./_castPath');
 const isArguments = require('./isArguments');
 const isArray = require('./isArray');
 const isIndex = require('./_isIndex');
 const isKey = require('./_isKey');
 const isLength = require('./isLength');
 const isString = require('./isString');
 const toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  let result;
 let index = -1;
       let length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = (object !== null && object !== undefined) && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isString(object) || isArguments(object));
}

module.exports = hasPath;
