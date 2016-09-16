'use strict';
const convert = require('./convert');
 const func = convert('isArguments', require('../isArguments'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
