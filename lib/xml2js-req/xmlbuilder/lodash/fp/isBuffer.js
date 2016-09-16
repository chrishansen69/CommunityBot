'use strict';
const convert = require('./convert');
 const func = convert('isBuffer', require('../isBuffer'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
