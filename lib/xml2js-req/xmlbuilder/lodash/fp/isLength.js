'use strict';
const convert = require('./convert');
 const func = convert('isLength', require('../isLength'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
