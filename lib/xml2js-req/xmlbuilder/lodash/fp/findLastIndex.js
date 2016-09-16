'use strict';
const convert = require('./convert');
 const func = convert('findLastIndex', require('../findLastIndex'));

func.placeholder = require('./placeholder');
module.exports = func;
