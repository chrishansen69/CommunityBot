'use strict';
const convert = require('./convert');
 const func = convert('startsWith', require('../startsWith'));

func.placeholder = require('./placeholder');
module.exports = func;
