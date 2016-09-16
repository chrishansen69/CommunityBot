'use strict';
const convert = require('./convert');
 const func = convert('keys', require('../keys'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
