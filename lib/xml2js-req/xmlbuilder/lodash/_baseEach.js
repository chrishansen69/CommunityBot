'use strict';
const baseForOwn = require('./_baseForOwn');
 const createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
const baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;
