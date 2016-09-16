'use strict';
const convert = require('./convert');
 const func = convert('unescape', require('../unescape'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
