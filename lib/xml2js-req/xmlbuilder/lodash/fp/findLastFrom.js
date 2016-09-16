'use strict';
const convert = require('./convert');
 const func = convert('findLastFrom', require('../findLast'));

func.placeholder = require('./placeholder');
module.exports = func;
