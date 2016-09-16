'use strict';
/** Used to compose unicode character classes. */
const rsAstralRange = '\\ud800-\\udfff';
 const rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
 const rsComboSymbolsRange = '\\u20d0-\\u20f0';
 const rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
const rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
const reHasComplexSymbol = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

module.exports = reHasComplexSymbol;
