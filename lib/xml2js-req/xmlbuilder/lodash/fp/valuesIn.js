'use strict';
const convert = require('./convert');
 const func = convert('valuesIn', require('../valuesIn'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
