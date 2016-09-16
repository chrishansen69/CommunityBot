'use strict';
const apply = require('./_apply');
 const createCtorWrapper = require('./_createCtorWrapper');
 const createHybridWrapper = require('./_createHybridWrapper');
 const createRecurryWrapper = require('./_createRecurryWrapper');
 const getHolder = require('./_getHolder');
 const replaceHolders = require('./_replaceHolders');
 const root = require('./_root');

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurryWrapper(func, bitmask, arity) {
  const Ctor = createCtorWrapper(func);

  function wrapper() {
    let length = arguments.length;
 const args = Array(length);
 let index = length;
 const placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    const holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurryWrapper(
        func, bitmask, createHybridWrapper, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    const fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}

module.exports = createCurryWrapper;
