'use strict';
const convert = require('./convert');
 const func = convert('min', require('../min'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
