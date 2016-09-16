'use strict';
const convert = require('./convert');
 const func = convert('isInteger', require('../isInteger'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
