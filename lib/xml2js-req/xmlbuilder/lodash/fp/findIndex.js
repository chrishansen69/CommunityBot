'use strict';
const convert = require('./convert');
 const func = convert('findIndex', require('../findIndex'));

func.placeholder = require('./placeholder');
module.exports = func;
