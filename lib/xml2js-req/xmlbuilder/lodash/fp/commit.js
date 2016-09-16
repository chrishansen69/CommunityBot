'use strict';
const convert = require('./convert');
 const func = convert('commit', require('../commit'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
