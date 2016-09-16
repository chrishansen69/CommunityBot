'use strict';
const convert = require('./convert');
 const func = convert('take', require('../take'));

func.placeholder = require('./placeholder');
module.exports = func;
