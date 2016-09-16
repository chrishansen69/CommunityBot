'use strict';
const convert = require('./convert');
 const func = convert('isSymbol', require('../isSymbol'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
