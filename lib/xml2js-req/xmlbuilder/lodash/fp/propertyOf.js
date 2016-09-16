'use strict';
const convert = require('./convert');
 const func = convert('propertyOf', require('../propertyOf'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
