'use strict';
const convert = require('./convert');
 const func = convert('value', require('../value'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
