'use strict';
const DataView = require('./_DataView');
 const Map = require('./_Map');
 const Promise = require('./_Promise');
 const Set = require('./_Set');
 const WeakMap = require('./_WeakMap');
 const toSource = require('./_toSource');

/** `Object#toString` result references. */
const mapTag = '[object Map]';
 const objectTag = '[object Object]';
 const promiseTag = '[object Promise]';
 const setTag = '[object Set]';
 const weakMapTag = '[object WeakMap]';

const dataViewTag = '[object DataView]';

/** Used for built-in method references. */
const objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
const objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
const dataViewCtorString = toSource(DataView);
 const mapCtorString = toSource(Map);
 const promiseCtorString = toSource(Promise);
 const setCtorString = toSource(Set);
 const weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
  return objectToString.call(value);
}

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    const result = objectToString.call(value);
 const Ctor = result == objectTag ? value.constructor : undefined;
 const ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;
