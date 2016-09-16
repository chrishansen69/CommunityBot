'use strict';
const convert = require('./convert');
 const func = convert('noop', require('../noop'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
