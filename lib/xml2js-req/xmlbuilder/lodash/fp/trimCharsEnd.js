'use strict';
const convert = require('./convert');
 const func = convert('trimCharsEnd', require('../trimEnd'));

func.placeholder = require('./placeholder');
module.exports = func;
