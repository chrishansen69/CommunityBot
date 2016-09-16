'use strict';
const convert = require('./convert');
 const func = convert('flip', require('../flip'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
