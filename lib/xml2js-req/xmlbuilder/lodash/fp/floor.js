'use strict';
const convert = require('./convert');
 const func = convert('floor', require('../floor'));

func.placeholder = require('./placeholder');
module.exports = func;
