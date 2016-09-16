'use strict';
const convert = require('./convert');
 const func = convert('eq', require('../eq'));

func.placeholder = require('./placeholder');
module.exports = func;
