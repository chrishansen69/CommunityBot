'use strict';
const convert = require('./convert');
 const func = convert('next', require('../next'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
