'use strict';
const convert = require('./convert');
 const func = convert('toIterator', require('../toIterator'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
