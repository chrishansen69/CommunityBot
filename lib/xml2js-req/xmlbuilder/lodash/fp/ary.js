'use strict';
const convert = require('./convert');
 const func = convert('ary', require('../ary'));

func.placeholder = require('./placeholder');
module.exports = func;
