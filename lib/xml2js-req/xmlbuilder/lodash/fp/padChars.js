'use strict';
const convert = require('./convert');
 const func = convert('padChars', require('../pad'));

func.placeholder = require('./placeholder');
module.exports = func;
