'use strict';
/**
 * The inverse of `_.toPairs`; this method returns an object composed
 * from key-value `pairs`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} pairs The key-value pairs.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.fromPairs([['fred', 30], ['barney', 40]]);
 * // => { 'fred': 30, 'barney': 40 }
 */
function fromPairs(pairs) {
  let index = -1;
       const length = pairs ? pairs.length : 0;
 const result = {};

  while (++index < length) {
    const pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}

module.exports = fromPairs;
