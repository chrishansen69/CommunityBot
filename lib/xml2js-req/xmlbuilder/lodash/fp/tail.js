'use strict';
const convert = require('./convert');
 const func = convert('tail', require('../tail'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
