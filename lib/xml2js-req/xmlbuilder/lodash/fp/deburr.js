'use strict';
const convert = require('./convert');
 const func = convert('deburr', require('../deburr'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
