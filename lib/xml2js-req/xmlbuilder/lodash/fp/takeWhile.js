'use strict';
const convert = require('./convert');
 const func = convert('takeWhile', require('../takeWhile'));

func.placeholder = require('./placeholder');
module.exports = func;
