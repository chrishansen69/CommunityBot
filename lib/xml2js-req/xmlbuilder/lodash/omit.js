'use strict';
const arrayMap = require('./_arrayMap');
 const baseDifference = require('./_baseDifference');
 const baseFlatten = require('./_baseFlatten');
 const basePick = require('./_basePick');
 const getAllKeysIn = require('./_getAllKeysIn');
 const rest = require('./rest');
 const toKey = require('./_toKey');

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable string keyed properties of `object` that are
 * not omitted.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [props] The property identifiers to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
const omit = rest(function(object, props) {
  if ((object === null || object === undefined)) {
    return {};
  }
  props = arrayMap(baseFlatten(props, 1), toKey);
  return basePick(object, baseDifference(getAllKeysIn(object), props));
});

module.exports = omit;
