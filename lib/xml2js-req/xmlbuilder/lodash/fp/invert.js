'use strict';
const convert = require('./convert');
 const func = convert('invert', require('../invert'));

func.placeholder = require('./placeholder');
module.exports = func;
