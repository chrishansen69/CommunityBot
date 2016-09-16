'use strict';
const convert = require('./convert');
 const func = convert('escape', require('../escape'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
