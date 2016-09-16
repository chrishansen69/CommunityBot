'use strict';
const convert = require('./convert');
 const func = convert('getOr', require('../get'));

func.placeholder = require('./placeholder');
module.exports = func;
