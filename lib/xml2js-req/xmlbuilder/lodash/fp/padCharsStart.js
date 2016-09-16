'use strict';
const convert = require('./convert');
 const func = convert('padCharsStart', require('../padStart'));

func.placeholder = require('./placeholder');
module.exports = func;
