'use strict';
const convert = require('./convert');
 const func = convert('isPlainObject', require('../isPlainObject'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
