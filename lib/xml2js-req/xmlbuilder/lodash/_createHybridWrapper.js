'use strict';
const composeArgs = require('./_composeArgs');
 const composeArgsRight = require('./_composeArgsRight');
 const countHolders = require('./_countHolders');
 const createCtorWrapper = require('./_createCtorWrapper');
 const createRecurryWrapper = require('./_createRecurryWrapper');
 const getHolder = require('./_getHolder');
 const reorder = require('./_reorder');
 const replaceHolders = require('./_replaceHolders');
 const root = require('./_root');

/** Used to compose bitmasks for wrapper metadata. */
const BIND_FLAG = 1;
 const BIND_KEY_FLAG = 2;
 const CURRY_FLAG = 8;
 const CURRY_RIGHT_FLAG = 16;
 const ARY_FLAG = 128;
 const FLIP_FLAG = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper`
 *  for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  const isAry = bitmask & ARY_FLAG;
 const isBind = bitmask & BIND_FLAG;
 const isBindKey = bitmask & BIND_KEY_FLAG;
 const isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG);
 const isFlip = bitmask & FLIP_FLAG;
 const Ctor = isBindKey ? undefined : createCtorWrapper(func);

  function wrapper() {
    let length = arguments.length;
 let args = Array(length);
 let index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      const newHolders = replaceHolders(args, placeholder);
      return createRecurryWrapper(
        func, bitmask, createHybridWrapper, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    const thisBinding = isBind ? thisArg : this;
 let fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtorWrapper(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

module.exports = createHybridWrapper;
