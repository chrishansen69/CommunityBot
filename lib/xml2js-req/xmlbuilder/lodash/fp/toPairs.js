'use strict';
const convert = require('./convert');
 const func = convert('toPairs', require('../toPairs'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
