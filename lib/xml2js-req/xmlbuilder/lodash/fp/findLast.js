'use strict';
const convert = require('./convert');
 const func = convert('findLast', require('../findLast'));

func.placeholder = require('./placeholder');
module.exports = func;
