'use strict';
const convert = require('./convert');
 const func = convert('isElement', require('../isElement'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
