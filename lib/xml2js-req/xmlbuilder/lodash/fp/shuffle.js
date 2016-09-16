'use strict';
const convert = require('./convert');
 const func = convert('shuffle', require('../shuffle'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
