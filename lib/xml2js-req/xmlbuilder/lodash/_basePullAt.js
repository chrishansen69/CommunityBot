'use strict';
const castPath = require('./_castPath');
 const isIndex = require('./_isIndex');
 const isKey = require('./_isKey');
 const last = require('./last');
 const parent = require('./_parent');
 const toKey = require('./_toKey');

/** Used for built-in method references. */
const arrayProto = Array.prototype;

/** Built-in value references. */
const splice = arrayProto.splice;

/**
 * The base implementation of `_.pullAt` without support for individual
 * indexes or capturing the removed elements.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {number[]} indexes The indexes of elements to remove.
 * @returns {Array} Returns `array`.
 */
function basePullAt(array, indexes) {
  let length = array ? indexes.length : 0;
 const lastIndex = length - 1;

  while (length--) {
    const index = indexes[length];
    if (length == lastIndex || index !== previous) {
      var previous = index;
      if (isIndex(index)) {
        splice.call(array, index, 1);
      }
      else if (!isKey(index, array)) {
        const path = castPath(index);
 const object = parent(array, path);

        if ((object !== null && object !== undefined)) {
          delete object[toKey(last(path))];
        }
      }
      else {
        delete array[toKey(index)];
      }
    }
  }
  return array;
}

module.exports = basePullAt;
