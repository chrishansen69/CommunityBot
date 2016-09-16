'use strict';
const checkGlobal = require('./_checkGlobal');

/** Detect free variable `global` from Node.js. */
const freeGlobal = checkGlobal(typeof global == 'object' && global);

/** Detect free variable `self`. */
const freeSelf = checkGlobal(typeof self == 'object' && self);

/** Detect `this` as the global object. */
const thisGlobal = checkGlobal(typeof this == 'object' && this);

/** Used as a reference to the global object. */
const root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

module.exports = root;
