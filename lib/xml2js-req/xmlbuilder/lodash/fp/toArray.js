'use strict';
const convert = require('./convert');
 const func = convert('toArray', require('../toArray'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
