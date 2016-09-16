'use strict';
const convert = require('./convert');
 const func = convert('sortedIndex', require('../sortedIndex'));

func.placeholder = require('./placeholder');
module.exports = func;
