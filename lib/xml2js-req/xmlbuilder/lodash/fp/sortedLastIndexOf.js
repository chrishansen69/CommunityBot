'use strict';
const convert = require('./convert');
 const func = convert('sortedLastIndexOf', require('../sortedLastIndexOf'));

func.placeholder = require('./placeholder');
module.exports = func;
