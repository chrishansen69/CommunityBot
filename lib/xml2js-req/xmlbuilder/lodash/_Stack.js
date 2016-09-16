'use strict';
const ListCache = require('./_ListCache');
 const stackClear = require('./_stackClear');
 const stackDelete = require('./_stackDelete');
 const stackGet = require('./_stackGet');
 const stackHas = require('./_stackHas');
 const stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype.delete = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;
