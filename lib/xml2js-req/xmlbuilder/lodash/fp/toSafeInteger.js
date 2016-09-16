'use strict';
const convert = require('./convert');
 const func = convert('toSafeInteger', require('../toSafeInteger'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
