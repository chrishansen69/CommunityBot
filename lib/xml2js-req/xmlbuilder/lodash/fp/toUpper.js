'use strict';
const convert = require('./convert');
 const func = convert('toUpper', require('../toUpper'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
