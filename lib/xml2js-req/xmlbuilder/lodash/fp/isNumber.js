'use strict';
const convert = require('./convert');
 const func = convert('isNumber', require('../isNumber'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
