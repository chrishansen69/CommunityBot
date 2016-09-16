'use strict';
const convert = require('./convert');
 const func = convert('isWeakMap', require('../isWeakMap'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
