'use strict';
const convert = require('./convert');
 const func = convert('toPlainObject', require('../toPlainObject'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
