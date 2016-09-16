'use strict';
const convert = require('./convert');
 const func = convert('sortedLastIndex', require('../sortedLastIndex'));

func.placeholder = require('./placeholder');
module.exports = func;
