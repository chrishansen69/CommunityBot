'use strict';
const convert = require('./convert');
 const func = convert('isTypedArray', require('../isTypedArray'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
