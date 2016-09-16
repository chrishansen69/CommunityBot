'use strict';
const convert = require('./convert');
 const func = convert('isNil', require('../isNil'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
