'use strict';
const cloneArrayBuffer = require('./_cloneArrayBuffer');
 const cloneDataView = require('./_cloneDataView');
 const cloneMap = require('./_cloneMap');
 const cloneRegExp = require('./_cloneRegExp');
 const cloneSet = require('./_cloneSet');
 const cloneSymbol = require('./_cloneSymbol');
 const cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
const boolTag = '[object Boolean]';
 const dateTag = '[object Date]';
 const mapTag = '[object Map]';
 const numberTag = '[object Number]';
 const regexpTag = '[object RegExp]';
 const setTag = '[object Set]';
 const stringTag = '[object String]';
 const symbolTag = '[object Symbol]';

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

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  const Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;
