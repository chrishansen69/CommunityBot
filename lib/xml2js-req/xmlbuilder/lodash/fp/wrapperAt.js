'use strict';
const convert = require('./convert');
 const func = convert('wrapperAt', require('../wrapperAt'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
