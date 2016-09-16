'use strict';
const convert = require('./convert');
 const func = convert('findLastIndexFrom', require('../findLastIndex'));

func.placeholder = require('./placeholder');
module.exports = func;
