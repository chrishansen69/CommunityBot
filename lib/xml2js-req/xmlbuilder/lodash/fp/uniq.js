'use strict';
const convert = require('./convert');
 const func = convert('uniq', require('../uniq'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
