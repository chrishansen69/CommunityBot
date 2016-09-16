'use strict';
const convert = require('./convert');
 const func = convert('curryRightN', require('../curryRight'));

func.placeholder = require('./placeholder');
module.exports = func;
