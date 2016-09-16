'use strict';
const coreJsData = require('./_coreJsData');
 const isFunction = require('./isFunction');
 const stubFalse = require('./stubFalse');

/**
 * Checks if `func` is capable of being masked.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
 */
const isMaskable = coreJsData ? isFunction : stubFalse;

module.exports = isMaskable;
