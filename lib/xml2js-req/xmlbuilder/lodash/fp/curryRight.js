'use strict';
const convert = require('./convert');
 const func = convert('curryRight', require('../curryRight'));

func.placeholder = require('./placeholder');
module.exports = func;
