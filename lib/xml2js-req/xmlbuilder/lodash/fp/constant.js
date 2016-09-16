'use strict';
const convert = require('./convert');
 const func = convert('constant', require('../constant'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
