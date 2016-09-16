'use strict';
const convert = require('./convert');
 const func = convert('unary', require('../unary'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
