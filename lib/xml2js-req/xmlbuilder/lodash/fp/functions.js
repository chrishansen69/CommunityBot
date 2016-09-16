'use strict';
const convert = require('./convert');
 const func = convert('functions', require('../functions'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
