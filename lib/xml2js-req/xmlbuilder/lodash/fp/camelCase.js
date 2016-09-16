'use strict';
const convert = require('./convert');
 const func = convert('camelCase', require('../camelCase'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
