'use strict';
const apply = require('./_apply');
 const createCtorWrapper = require('./_createCtorWrapper');
 const root = require('./_root');

/** Used to compose bitmasks for wrapper metadata. */
const BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  const isBind = bitmask & BIND_FLAG;
 const Ctor = createCtorWrapper(func);

  function wrapper() {
    let argsIndex = -1;
 let argsLength = arguments.length;
 let leftIndex = -1;
 const leftLength = partials.length;
 const args = Array(leftLength + argsLength);
 const fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

module.exports = createPartialWrapper;
