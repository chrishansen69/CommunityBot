'use strict';
const convert = require('./convert');
 const func = convert('chain', require('../chain'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
