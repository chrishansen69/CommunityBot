'use strict';
const convert = require('./convert');
 const func = convert('stubString', require('../stubString'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
