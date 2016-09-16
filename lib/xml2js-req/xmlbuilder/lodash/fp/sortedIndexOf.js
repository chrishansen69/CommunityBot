'use strict';
const convert = require('./convert');
 const func = convert('sortedIndexOf', require('../sortedIndexOf'));

func.placeholder = require('./placeholder');
module.exports = func;
