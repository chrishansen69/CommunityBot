'use strict';
const convert = require('./convert');
 const func = convert('isString', require('../isString'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
