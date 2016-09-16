'use strict';
const convert = require('./convert');
 const func = convert('every', require('../every'));

func.placeholder = require('./placeholder');
module.exports = func;
