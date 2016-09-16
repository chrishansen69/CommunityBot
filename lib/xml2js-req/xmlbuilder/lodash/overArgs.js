'use strict';
const apply = require('./_apply');
 const arrayMap = require('./_arrayMap');
 const baseFlatten = require('./_baseFlatten');
 const baseIteratee = require('./_baseIteratee');
 const baseUnary = require('./_baseUnary');
 const isArray = require('./isArray');
 const isFlattenableIteratee = require('./_isFlattenableIteratee');
 const rest = require('./rest');

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeMin = Math.min;

/**
 * Creates a function that invokes `func` with arguments transformed by
 * corresponding `transforms`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Function
 * @param {Function} func The function to wrap.
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [transforms[_.identity]] The functions to transform.
 * @returns {Function} Returns the new function.
 * @example
 *
 * function doubled(n) {
 *   return n * 2;
 * }
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var func = _.overArgs(function(x, y) {
 *   return [x, y];
 * }, [square, doubled]);
 *
 * func(9, 3);
 * // => [81, 6]
 *
 * func(10, 5);
 * // => [100, 10]
 */
const overArgs = rest(function(func, transforms) {
  transforms = (transforms.length == 1 && isArray(transforms[0]))
    ? arrayMap(transforms[0], baseUnary(baseIteratee))
    : arrayMap(baseFlatten(transforms, 1, isFlattenableIteratee), baseUnary(baseIteratee));

  const funcsLength = transforms.length;
  return rest(function(args) {
    let index = -1;
         const length = nativeMin(args.length, funcsLength);

    while (++index < length) {
      args[index] = transforms[index].call(this, args[index]);
    }
    return apply(func, this, args);
  });
});

module.exports = overArgs;
