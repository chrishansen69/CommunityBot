'use strict';
const convert = require('./convert');
 const func = convert('kebabCase', require('../kebabCase'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
