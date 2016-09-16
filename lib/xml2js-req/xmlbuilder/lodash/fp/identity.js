'use strict';
const convert = require('./convert');
 const func = convert('identity', require('../identity'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
