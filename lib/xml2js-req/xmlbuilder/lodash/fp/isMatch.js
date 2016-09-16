'use strict';
const convert = require('./convert');
 const func = convert('isMatch', require('../isMatch'));

func.placeholder = require('./placeholder');
module.exports = func;
