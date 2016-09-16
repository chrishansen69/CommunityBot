'use strict';
const convert = require('./convert');
 const func = convert('reject', require('../reject'));

func.placeholder = require('./placeholder');
module.exports = func;
