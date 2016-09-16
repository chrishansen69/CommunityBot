'use strict';
const convert = require('./convert');
 const func = convert('isArray', require('../isArray'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
