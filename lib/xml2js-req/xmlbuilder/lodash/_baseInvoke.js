'use strict';
const apply = require('./_apply');
 const castPath = require('./_castPath');
 const isKey = require('./_isKey');
 const last = require('./last');
 const parent = require('./_parent');
 const toKey = require('./_toKey');

/**
 * The base implementation of `_.invoke` without support for individual
 * method arguments.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function baseInvoke(object, path, args) {
  if (!isKey(path, object)) {
    path = castPath(path);
    object = parent(object, path);
    path = last(path);
  }
  const func = (object === null || object === undefined) ? object : object[toKey(path)];
  return (func === null || func === undefined) ? undefined : apply(func, object, args);
}

module.exports = baseInvoke;
