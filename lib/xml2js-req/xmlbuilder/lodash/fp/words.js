'use strict';
const convert = require('./convert');
 const func = convert('words', require('../words'));

func.placeholder = require('./placeholder');
module.exports = func;
