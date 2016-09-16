'use strict';
const convert = require('./convert');
 const func = convert('stubArray', require('../stubArray'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
