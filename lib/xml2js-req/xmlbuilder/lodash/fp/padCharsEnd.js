'use strict';
const convert = require('./convert');
 const func = convert('padCharsEnd', require('../padEnd'));

func.placeholder = require('./placeholder');
module.exports = func;
