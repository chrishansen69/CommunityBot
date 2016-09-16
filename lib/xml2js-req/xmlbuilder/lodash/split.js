'use strict';
const baseToString = require('./_baseToString');
 const castSlice = require('./_castSlice');
 const isIterateeCall = require('./_isIterateeCall');
 const isRegExp = require('./isRegExp');
 const reHasComplexSymbol = require('./_reHasComplexSymbol');
 const stringToArray = require('./_stringToArray');
 const toString = require('./toString');

/** Used as references for the maximum length and index of an array. */
const MAX_ARRAY_LENGTH = 4294967295;

/** Used for built-in method references. */
const stringProto = String.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeSplit = stringProto.split;

/**
 * Splits `string` by `separator`.
 *
 * **Note:** This method is based on
 * [`String#split`](https://mdn.io/String/split).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to split.
 * @param {RegExp|string} separator The separator pattern to split by.
 * @param {number} [limit] The length to truncate results to.
 * @returns {Array} Returns the string segments.
 * @example
 *
 * _.split('a-b-c', '-', 2);
 * // => ['a', 'b']
 */
function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }
  limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
  if (!limit) {
    return [];
  }
  string = toString(string);
  if (string && (
        typeof separator == 'string' ||
        ((separator !== null && separator !== undefined) && !isRegExp(separator))
      )) {
    separator = baseToString(separator);
    if (separator == '' && reHasComplexSymbol.test(string)) {
      return castSlice(stringToArray(string), 0, limit);
    }
  }
  return nativeSplit.call(string, separator, limit);
}

module.exports = split;
