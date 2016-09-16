'use strict';
const convert = require('./convert');
 const func = convert('endsWith', require('../endsWith'));

func.placeholder = require('./placeholder');
module.exports = func;
