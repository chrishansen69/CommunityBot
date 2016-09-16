'use strict';
const convert = require('./convert');
 const func = convert('difference', require('../difference'));

func.placeholder = require('./placeholder');
module.exports = func;
