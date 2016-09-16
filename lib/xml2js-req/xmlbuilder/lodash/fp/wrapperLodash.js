'use strict';
const convert = require('./convert');
 const func = convert('wrapperLodash', require('../wrapperLodash'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
