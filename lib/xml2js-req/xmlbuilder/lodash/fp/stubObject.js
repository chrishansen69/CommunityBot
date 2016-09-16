'use strict';
const convert = require('./convert');
 const func = convert('stubObject', require('../stubObject'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
