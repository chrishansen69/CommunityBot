'use strict';
const convert = require('./convert');
 const func = convert('ceil', require('../ceil'));

func.placeholder = require('./placeholder');
module.exports = func;
