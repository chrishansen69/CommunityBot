'use strict';
const convert = require('./convert');
 const func = convert('isArrayLike', require('../isArrayLike'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
