'use strict';
const convert = require('./convert');
 const func = convert('toJSON', require('../toJSON'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
