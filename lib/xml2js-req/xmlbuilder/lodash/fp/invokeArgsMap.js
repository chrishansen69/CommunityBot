'use strict';
const convert = require('./convert');
 const func = convert('invokeArgsMap', require('../invokeMap'));

func.placeholder = require('./placeholder');
module.exports = func;
