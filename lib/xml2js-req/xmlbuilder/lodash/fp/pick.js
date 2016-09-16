'use strict';
const convert = require('./convert');
 const func = convert('pick', require('../pick'));

func.placeholder = require('./placeholder');
module.exports = func;
