'use strict';
const convert = require('./convert');
 const func = convert('size', require('../size'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
