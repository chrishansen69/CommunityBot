'use strict';
const convert = require('./convert');
 const func = convert('isDate', require('../isDate'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
