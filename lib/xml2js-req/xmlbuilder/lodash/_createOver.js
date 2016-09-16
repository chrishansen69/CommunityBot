'use strict';
const apply = require('./_apply');
 const arrayMap = require('./_arrayMap');
 const baseFlatten = require('./_baseFlatten');
 const baseIteratee = require('./_baseIteratee');
 const baseUnary = require('./_baseUnary');
 const isArray = require('./isArray');
 const isFlattenableIteratee = require('./_isFlattenableIteratee');
 const rest = require('./rest');

/**
 * Creates a function like `_.over`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over iteratees.
 * @returns {Function} Returns the new over function.
 */
function createOver(arrayFunc) {
  return rest(function(iteratees) {
    iteratees = (iteratees.length == 1 && isArray(iteratees[0]))
      ? arrayMap(iteratees[0], baseUnary(baseIteratee))
      : arrayMap(baseFlatten(iteratees, 1, isFlattenableIteratee), baseUnary(baseIteratee));

    return rest(function(args) {
      const thisArg = this;
      return arrayFunc(iteratees, function(iteratee) {
        return apply(iteratee, thisArg, args);
      });
    });
  });
}

module.exports = createOver;
