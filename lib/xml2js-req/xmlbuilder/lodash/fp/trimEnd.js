'use strict';
const convert = require('./convert');
 const func = convert('trimEnd', require('../trimEnd'));

func.placeholder = require('./placeholder');
module.exports = func;
