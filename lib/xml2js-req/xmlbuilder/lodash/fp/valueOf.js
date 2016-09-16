'use strict';
const convert = require('./convert');
 const func = convert('valueOf', require('../valueOf'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
