'use strict';
const convert = require('./convert');
 const func = convert('isRegExp', require('../isRegExp'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
