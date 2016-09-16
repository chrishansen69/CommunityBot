'use strict';
const convert = require('./convert');
 const func = convert('toLength', require('../toLength'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
