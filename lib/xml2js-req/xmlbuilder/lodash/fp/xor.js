'use strict';
const convert = require('./convert');
 const func = convert('xor', require('../xor'));

func.placeholder = require('./placeholder');
module.exports = func;
