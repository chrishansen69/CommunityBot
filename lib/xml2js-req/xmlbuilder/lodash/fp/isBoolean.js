'use strict';
const convert = require('./convert');
 const func = convert('isBoolean', require('../isBoolean'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
