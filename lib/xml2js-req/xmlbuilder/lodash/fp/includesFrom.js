'use strict';
const convert = require('./convert');
 const func = convert('includesFrom', require('../includes'));

func.placeholder = require('./placeholder');
module.exports = func;
