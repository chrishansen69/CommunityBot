'use strict';
const convert = require('./convert');
 const func = convert('functionsIn', require('../functionsIn'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
