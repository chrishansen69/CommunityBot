'use strict';
const arrayPush = require('./_arrayPush');
 const getPrototype = require('./_getPrototype');
 const getSymbols = require('./_getSymbols');

/** Built-in value references. */
const getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbol properties
 * of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
const getSymbolsIn = !getOwnPropertySymbols ? getSymbols : function(object) {
  const result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;
