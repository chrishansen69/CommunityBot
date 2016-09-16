'use strict';
const convert = require('./convert');
 const func = convert('toInteger', require('../toInteger'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
