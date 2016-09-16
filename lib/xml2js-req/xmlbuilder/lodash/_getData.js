'use strict';
const metaMap = require('./_metaMap');
 const noop = require('./noop');

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
const getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;
