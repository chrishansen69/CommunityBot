'use strict';
const convert = require('./convert');
 const func = convert('isFunction', require('../isFunction'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
