'use strict';
const convert = require('./convert');
 const func = convert('cond', require('../cond'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
