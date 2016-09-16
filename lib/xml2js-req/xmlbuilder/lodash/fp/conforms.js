'use strict';
const convert = require('./convert');
 const func = convert('conforms', require('../conforms'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
