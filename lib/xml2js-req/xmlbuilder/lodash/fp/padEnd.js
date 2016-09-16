'use strict';
const convert = require('./convert');
 const func = convert('padEnd', require('../padEnd'));

func.placeholder = require('./placeholder');
module.exports = func;
