'use strict';
const convert = require('./convert');
 const func = convert('findIndexFrom', require('../findIndex'));

func.placeholder = require('./placeholder');
module.exports = func;
