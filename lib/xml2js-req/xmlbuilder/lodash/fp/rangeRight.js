'use strict';
const convert = require('./convert');
 const func = convert('rangeRight', require('../rangeRight'));

func.placeholder = require('./placeholder');
module.exports = func;
