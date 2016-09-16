'use strict';
const convert = require('./convert');
 const func = convert('toPath', require('../toPath'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
