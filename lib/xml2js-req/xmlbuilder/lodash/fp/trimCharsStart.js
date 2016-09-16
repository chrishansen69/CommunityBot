'use strict';
const convert = require('./convert');
 const func = convert('trimCharsStart', require('../trimStart'));

func.placeholder = require('./placeholder');
module.exports = func;
