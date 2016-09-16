'use strict';
const convert = require('./convert');
 const func = convert('last', require('../last'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
