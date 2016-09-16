'use strict';
const convert = require('./convert');
 const func = convert('initial', require('../initial'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
