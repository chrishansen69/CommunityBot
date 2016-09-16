'use strict';
const convert = require('./convert');
 const func = convert('isNative', require('../isNative'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
