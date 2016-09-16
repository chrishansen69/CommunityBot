'use strict';
const convert = require('./convert');
 const func = convert('replace', require('../replace'));

func.placeholder = require('./placeholder');
module.exports = func;
