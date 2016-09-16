'use strict';
const convert = require('./convert');
 const func = convert('wrapperChain', require('../wrapperChain'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
