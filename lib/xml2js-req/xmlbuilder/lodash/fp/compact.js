'use strict';
const convert = require('./convert');
 const func = convert('compact', require('../compact'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
