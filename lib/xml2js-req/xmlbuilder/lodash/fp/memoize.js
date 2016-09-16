'use strict';
const convert = require('./convert');
 const func = convert('memoize', require('../memoize'));

func.placeholder = require('./placeholder');
module.exports = func;
