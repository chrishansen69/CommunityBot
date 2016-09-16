'use strict';
const convert = require('./convert');
 const func = convert('templateSettings', require('../templateSettings'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
