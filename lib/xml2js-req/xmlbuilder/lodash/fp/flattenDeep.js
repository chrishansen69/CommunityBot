'use strict';
const convert = require('./convert');
 const func = convert('flattenDeep', require('../flattenDeep'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
