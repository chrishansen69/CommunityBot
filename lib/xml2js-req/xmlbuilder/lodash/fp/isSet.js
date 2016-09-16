'use strict';
const convert = require('./convert');
 const func = convert('isSet', require('../isSet'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
