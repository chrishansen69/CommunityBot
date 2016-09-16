'use strict';
const convert = require('./convert');
 const func = convert('keysIn', require('../keysIn'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
