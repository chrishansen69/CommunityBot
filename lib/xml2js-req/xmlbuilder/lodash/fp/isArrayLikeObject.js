'use strict';
const convert = require('./convert');
 const func = convert('isArrayLikeObject', require('../isArrayLikeObject'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
