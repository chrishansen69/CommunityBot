'use strict';
const convert = require('./convert');
 const func = convert('isMap', require('../isMap'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
