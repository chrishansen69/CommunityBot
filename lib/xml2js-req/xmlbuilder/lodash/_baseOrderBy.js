'use strict';
const arrayMap = require('./_arrayMap');
 const baseIteratee = require('./_baseIteratee');
 const baseMap = require('./_baseMap');
 const baseSortBy = require('./_baseSortBy');
 const baseUnary = require('./_baseUnary');
 const compareMultiple = require('./_compareMultiple');
 const identity = require('./identity');

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  let index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  const result = baseMap(collection, function(value, key, collection) {
    const criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;
