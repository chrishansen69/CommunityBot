'use strict';
const convert = require('./convert');
 const func = convert('defer', require('../defer'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
