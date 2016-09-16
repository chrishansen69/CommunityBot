'use strict';
const convert = require('./convert');
 const func = convert('takeRightWhile', require('../takeRightWhile'));

func.placeholder = require('./placeholder');
module.exports = func;
