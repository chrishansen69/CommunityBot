'use strict';
const convert = require('./convert');
 const func = convert('isEmpty', require('../isEmpty'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
