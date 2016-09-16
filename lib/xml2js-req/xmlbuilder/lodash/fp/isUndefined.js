'use strict';
const convert = require('./convert');
 const func = convert('isUndefined', require('../isUndefined'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
