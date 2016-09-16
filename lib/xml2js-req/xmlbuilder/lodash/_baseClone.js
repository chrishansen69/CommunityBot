'use strict';
const Stack = require('./_Stack');
 const arrayEach = require('./_arrayEach');
 const assignValue = require('./_assignValue');
 const baseAssign = require('./_baseAssign');
 const cloneBuffer = require('./_cloneBuffer');
 const copyArray = require('./_copyArray');
 const copySymbols = require('./_copySymbols');
 const getAllKeys = require('./_getAllKeys');
 const getTag = require('./_getTag');
 const initCloneArray = require('./_initCloneArray');
 const initCloneByTag = require('./_initCloneByTag');
 const initCloneObject = require('./_initCloneObject');
 const isArray = require('./isArray');
 const isBuffer = require('./isBuffer');
 const isHostObject = require('./_isHostObject');
 const isObject = require('./isObject');
 const keys = require('./keys');

/** `Object#toString` result references. */
const argsTag = '[object Arguments]';
 const arrayTag = '[object Array]';
 const boolTag = '[object Boolean]';
 const dateTag = '[object Date]';
 const errorTag = '[object Error]';
 const funcTag = '[object Function]';
 const genTag = '[object GeneratorFunction]';
 const mapTag = '[object Map]';
 const numberTag = '[object Number]';
 const objectTag = '[object Object]';
 const regexpTag = '[object RegExp]';
 const setTag = '[object Set]';
 const stringTag = '[object String]';
 const symbolTag = '[object Symbol]';
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

/** Used to identify `toStringTag` values supported by `_.clone`. */
const cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  let result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  const isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    const tag = getTag(value);
 const isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  if (!stack) stack = new Stack();
  const stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  let props;
  if (!isArr) {
    props = isFull ? getAllKeys(value) : keys(value);
  }
  // Recursively populate clone (susceptible to call stack limits).
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;
