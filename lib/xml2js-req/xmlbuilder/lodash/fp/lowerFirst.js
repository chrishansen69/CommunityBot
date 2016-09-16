'use strict';
const convert = require('./convert');
 const func = convert('lowerFirst', require('../lowerFirst'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
