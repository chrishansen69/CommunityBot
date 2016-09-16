'use strict';
const baseRepeat = require('./_baseRepeat');
 const baseToString = require('./_baseToString');
 const castSlice = require('./_castSlice');
 const reHasComplexSymbol = require('./_reHasComplexSymbol');
 const stringSize = require('./_stringSize');
 const stringToArray = require('./_stringToArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeCeil = Math.ceil;

/**
 * Creates the padding for `string` based on `length`. The `chars` string
 * is truncated if the number of characters exceeds `length`.
 *
 * @private
 * @param {number} length The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padding for `string`.
 */
function createPadding(length, chars) {
  chars = chars === undefined ? ' ' : baseToString(chars);

  const charsLength = chars.length;
  if (charsLength < 2) {
    return charsLength ? baseRepeat(chars, length) : chars;
  }
  const result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
  return reHasComplexSymbol.test(chars)
    ? castSlice(stringToArray(result), 0, length).join('')
    : result.slice(0, length);
}

module.exports = createPadding;
