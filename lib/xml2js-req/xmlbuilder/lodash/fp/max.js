'use strict';
const convert = require('./convert');
 const func = convert('max', require('../max'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
