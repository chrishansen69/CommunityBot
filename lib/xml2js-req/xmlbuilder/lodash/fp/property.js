'use strict';
const convert = require('./convert');
 const func = convert('property', require('../property'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
