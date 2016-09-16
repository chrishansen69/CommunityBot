'use strict';
const convert = require('./convert');
 const func = convert('stubTrue', require('../stubTrue'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
