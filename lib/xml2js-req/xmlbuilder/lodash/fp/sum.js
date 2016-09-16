'use strict';
const convert = require('./convert');
 const func = convert('sum', require('../sum'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
