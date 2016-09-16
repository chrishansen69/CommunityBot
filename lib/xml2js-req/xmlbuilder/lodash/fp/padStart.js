'use strict';
const convert = require('./convert');
 const func = convert('padStart', require('../padStart'));

func.placeholder = require('./placeholder');
module.exports = func;
