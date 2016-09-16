'use strict';
const convert = require('./convert');
 const func = convert('wrapperReverse', require('../wrapperReverse'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
