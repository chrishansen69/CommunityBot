'use strict';
const baseAt = require('./_baseAt');
 const baseFlatten = require('./_baseFlatten');
 const rest = require('./rest');

/**
 * Creates an array of values corresponding to `paths` of `object`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {...(string|string[])} [paths] The property paths of elements to pick.
 * @returns {Array} Returns the picked values.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _.at(object, ['a[0].b.c', 'a[1]']);
 * // => [3, 4]
 */
const at = rest(function(object, paths) {
  return baseAt(object, baseFlatten(paths, 1));
});

module.exports = at;
