'use strict';
const convert = require('./convert');
 const func = convert('isObject', require('../isObject'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
