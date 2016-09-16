'use strict';
const Symbol = require('./_Symbol');
 const copyArray = require('./_copyArray');
 const getTag = require('./_getTag');
 const isArrayLike = require('./isArrayLike');
 const isString = require('./isString');
 const iteratorToArray = require('./_iteratorToArray');
 const mapToArray = require('./_mapToArray');
 const setToArray = require('./_setToArray');
 const stringToArray = require('./_stringToArray');
 const values = require('./values');

/** `Object#toString` result references. */
const mapTag = '[object Map]';
 const setTag = '[object Set]';

/** Built-in value references. */
let iteratorSymbol = typeof (iteratorSymbol = Symbol && Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined;

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (iteratorSymbol && value[iteratorSymbol]) {
    return iteratorToArray(value[iteratorSymbol]());
  }
  const tag = getTag(value);
 const func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

  return func(value);
}

module.exports = toArray;
