'use strict';
const convert = require('./convert');
 const func = convert('isObjectLike', require('../isObjectLike'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
