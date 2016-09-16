'use strict';
const convert = require('./convert');
 const func = convert('trimChars', require('../trim'));

func.placeholder = require('./placeholder');
module.exports = func;
