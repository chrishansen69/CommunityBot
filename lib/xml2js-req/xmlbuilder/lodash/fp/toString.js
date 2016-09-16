'use strict';
const convert = require('./convert');
 const func = convert('toString', require('../toString'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
