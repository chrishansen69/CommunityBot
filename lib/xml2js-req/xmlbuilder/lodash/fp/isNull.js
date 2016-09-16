'use strict';
const convert = require('./convert');
 const func = convert('isNull', require('../isNull'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
