'use strict';
const convert = require('./convert');
 const func = convert('isNaN', require('../isNaN'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
