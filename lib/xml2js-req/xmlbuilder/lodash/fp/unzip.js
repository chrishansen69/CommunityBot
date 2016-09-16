'use strict';
const convert = require('./convert');
 const func = convert('unzip', require('../unzip'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
