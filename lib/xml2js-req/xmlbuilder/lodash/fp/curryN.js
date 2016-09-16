'use strict';
const convert = require('./convert');
 const func = convert('curryN', require('../curry'));

func.placeholder = require('./placeholder');
module.exports = func;
