'use strict';
const convert = require('./convert');
 const func = convert('values', require('../values'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
