'use strict';
const convert = require('./convert');
 const func = convert('negate', require('../negate'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
