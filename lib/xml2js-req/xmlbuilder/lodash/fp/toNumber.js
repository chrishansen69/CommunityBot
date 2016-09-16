'use strict';
const convert = require('./convert');
 const func = convert('toNumber', require('../toNumber'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
