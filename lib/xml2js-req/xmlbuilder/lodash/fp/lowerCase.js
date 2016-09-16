'use strict';
const convert = require('./convert');
 const func = convert('lowerCase', require('../lowerCase'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
