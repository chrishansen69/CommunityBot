'use strict';
const convert = require('./convert');
 const func = convert('isSafeInteger', require('../isSafeInteger'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
