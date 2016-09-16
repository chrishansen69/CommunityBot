'use strict';
const reHasComplexSymbol = require('./_reHasComplexSymbol');

/** Used to compose unicode character classes. */
const rsAstralRange = '\\ud800-\\udfff';
 const rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
 const rsComboSymbolsRange = '\\u20d0-\\u20f0';
 const rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
const rsAstral = '[' + rsAstralRange + ']';
 const rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']';
 const rsFitz = '\\ud83c[\\udffb-\\udfff]';
 const rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
 const rsNonAstral = '[^' + rsAstralRange + ']';
 const rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
 const rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
 const rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
const reOptMod = rsModifier + '?';
 const rsOptVar = '[' + rsVarRange + ']?';
 const rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
 const rsSeq = rsOptVar + reOptMod + rsOptJoin;
 const rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
const reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  if (!(string && reHasComplexSymbol.test(string))) {
    return string.length;
  }
  let result = reComplexSymbol.lastIndex = 0;
  while (reComplexSymbol.test(string)) {
    result++;
  }
  return result;
}

module.exports = stringSize;
