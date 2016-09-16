'use strict';
const convert = require('./convert');
 const func = convert('capitalize', require('../capitalize'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
