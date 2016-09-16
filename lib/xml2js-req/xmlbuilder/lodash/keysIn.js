'use strict';
const baseKeysIn = require('./_baseKeysIn');
 const indexKeys = require('./_indexKeys');
 const isIndex = require('./_isIndex');
 const isPrototype = require('./_isPrototype');

/** Used for built-in method references. */
const objectProto = Object.prototype;

/** Used to check objects for own properties. */
const hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  let index = -1;
 const isProto = isPrototype(object);
 const props = baseKeysIn(object);
 const propsLength = props.length;
 const indexes = indexKeys(object);
 const skipIndexes = !!indexes;
 const result = indexes || [];
       const length = result.length;

  while (++index < propsLength) {
    const key = props[index];
    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;
