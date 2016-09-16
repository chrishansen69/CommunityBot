'use strict';
const isLength = require('./isLength');
 const isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
const argsTag = '[object Arguments]';
 const arrayTag = '[object Array]';
 const boolTag = '[object Boolean]';
 const dateTag = '[object Date]';
 const errorTag = '[object Error]';
 const funcTag = '[object Function]';
 const mapTag = '[object Map]';
 const numberTag = '[object Number]';
 const objectTag = '[object Object]';
 const regexpTag = '[object RegExp]';
 const setTag = '[object Set]';
 const stringTag = '[object String]';
 const weakMapTag = '[object WeakMap]';

const arrayBufferTag = '[object ArrayBuffer]';
 const dataViewTag = '[object DataView]';
 const float32Tag = '[object Float32Array]';
 const float64Tag = '[object Float64Array]';
 const int8Tag = '[object Int8Array]';
 const int16Tag = '[object Int16Array]';
 const int32Tag = '[object Int32Array]';
 const uint8Tag = '[object Uint8Array]';
 const uint8ClampedTag = '[object Uint8ClampedArray]';
 const uint16Tag = '[object Uint16Array]';
 const uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
const typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Used for built-in method references. */
const objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
const objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = isTypedArray;
