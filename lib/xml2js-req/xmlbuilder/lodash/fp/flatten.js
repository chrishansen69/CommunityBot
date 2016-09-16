'use strict';
const convert = require('./convert');
 const func = convert('flatten', require('../flatten'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
