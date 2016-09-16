'use strict';
const convert = require('./convert');
 const func = convert('isError', require('../isError'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
