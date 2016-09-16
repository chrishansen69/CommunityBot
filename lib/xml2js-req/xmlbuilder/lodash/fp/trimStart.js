'use strict';
const convert = require('./convert');
 const func = convert('trimStart', require('../trimStart'));

func.placeholder = require('./placeholder');
module.exports = func;
