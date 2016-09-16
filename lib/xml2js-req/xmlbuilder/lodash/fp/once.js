'use strict';
const convert = require('./convert');
 const func = convert('once', require('../once'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
