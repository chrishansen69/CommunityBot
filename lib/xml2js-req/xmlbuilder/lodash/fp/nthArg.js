'use strict';
const convert = require('./convert');
 const func = convert('nthArg', require('../nthArg'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
