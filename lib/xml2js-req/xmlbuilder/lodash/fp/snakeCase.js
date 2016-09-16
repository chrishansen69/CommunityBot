'use strict';
const convert = require('./convert');
 const func = convert('snakeCase', require('../snakeCase'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
