'use strict';
const convert = require('./convert');
 const func = convert('defaults', require('../defaults'));

func.placeholder = require('./placeholder');
module.exports = func;
