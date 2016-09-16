'use strict';
const convert = require('./convert');
 const func = convert('wrapperValue', require('../wrapperValue'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
