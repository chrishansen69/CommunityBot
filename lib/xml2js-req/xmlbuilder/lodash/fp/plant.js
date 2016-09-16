'use strict';
const convert = require('./convert');
 const func = convert('plant', require('../plant'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
