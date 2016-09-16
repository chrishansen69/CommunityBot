'use strict';
const convert = require('./convert');
 const func = convert('escapeRegExp', require('../escapeRegExp'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
