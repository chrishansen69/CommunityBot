'use strict';
const LodashWrapper = require('./_LodashWrapper');
 const baseFlatten = require('./_baseFlatten');
 const getData = require('./_getData');
 const getFuncName = require('./_getFuncName');
 const isArray = require('./isArray');
 const isLaziable = require('./_isLaziable');
 const rest = require('./rest');

/** Used as the size to enable large array optimizations. */
const LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
const FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for wrapper metadata. */
const CURRY_FLAG = 8;
 const PARTIAL_FLAG = 32;
 const ARY_FLAG = 128;
 const REARG_FLAG = 256;

/**
 * Creates a `_.flow` or `_.flowRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new flow function.
 */
function createFlow(fromRight) {
  return rest(function(funcs) {
    funcs = baseFlatten(funcs, 1);

    const length = funcs.length;
 let index = length;
 const prereq = LodashWrapper.prototype.thru;

    if (fromRight) {
      funcs.reverse();
    }
    while (index--) {
      var func = funcs[index];
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
        var wrapper = new LodashWrapper([], true);
      }
    }
    index = wrapper ? index : length;
    while (++index < length) {
      func = funcs[index];

      const funcName = getFuncName(func);
 const data = funcName == 'wrapper' ? getData(func) : undefined;

      if (data && isLaziable(data[0]) &&
            data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) &&
            !data[4].length && data[9] == 1
          ) {
        wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
      } else {
        wrapper = (func.length == 1 && isLaziable(func))
          ? wrapper[funcName]()
          : wrapper.thru(func);
      }
    }
    return function() {
      const args = arguments;
 const value = args[0];

      if (wrapper && args.length == 1 &&
          isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
        return wrapper.plant(value).value();
      }
      let index = 0;
 let result = length ? funcs[index].apply(this, args) : value;

      while (++index < length) {
        result = funcs[index].call(this, result);
      }
      return result;
    };
  });
}

module.exports = createFlow;
