'use strict';
const convert = require('./convert');
 const func = convert('sample', require('../sample'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
