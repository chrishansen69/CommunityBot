'use strict';
const convert = require('./convert');
 const func = convert('upperCase', require('../upperCase'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
