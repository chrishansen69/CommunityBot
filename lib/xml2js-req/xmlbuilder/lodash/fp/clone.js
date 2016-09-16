'use strict';
const convert = require('./convert');
 const func = convert('clone', require('../clone'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
