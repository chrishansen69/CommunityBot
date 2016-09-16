'use strict';
const convert = require('./convert');
 const func = convert('now', require('../now'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
