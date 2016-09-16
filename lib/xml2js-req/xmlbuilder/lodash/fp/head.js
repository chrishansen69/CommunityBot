'use strict';
const convert = require('./convert');
 const func = convert('head', require('../head'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
