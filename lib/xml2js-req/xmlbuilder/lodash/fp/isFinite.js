'use strict';
const convert = require('./convert');
 const func = convert('isFinite', require('../isFinite'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
