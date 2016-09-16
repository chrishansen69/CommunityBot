'use strict';
const convert = require('./convert');
 const func = convert('stubFalse', require('../stubFalse'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
