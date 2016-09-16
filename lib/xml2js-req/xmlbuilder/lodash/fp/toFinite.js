'use strict';
const convert = require('./convert');
 const func = convert('toFinite', require('../toFinite'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
