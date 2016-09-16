'use strict';
const convert = require('./convert');
 const func = convert('invokeMap', require('../invokeMap'));

func.placeholder = require('./placeholder');
module.exports = func;
