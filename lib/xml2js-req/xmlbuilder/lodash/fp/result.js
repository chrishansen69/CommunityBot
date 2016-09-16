'use strict';
const convert = require('./convert');
 const func = convert('result', require('../result'));

func.placeholder = require('./placeholder');
module.exports = func;
