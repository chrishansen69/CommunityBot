'use strict';
const convert = require('./convert');
 const func = convert('get', require('../get'));

func.placeholder = require('./placeholder');
module.exports = func;
