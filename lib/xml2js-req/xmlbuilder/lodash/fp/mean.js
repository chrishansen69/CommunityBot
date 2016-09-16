'use strict';
const convert = require('./convert');
 const func = convert('mean', require('../mean'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
