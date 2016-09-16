'use strict';
const convert = require('./convert');
 const func = convert('isWeakSet', require('../isWeakSet'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
