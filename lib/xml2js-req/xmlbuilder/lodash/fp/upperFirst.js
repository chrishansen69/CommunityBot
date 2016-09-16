'use strict';
const convert = require('./convert');
 const func = convert('upperFirst', require('../upperFirst'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
