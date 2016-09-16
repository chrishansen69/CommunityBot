'use strict';
const convert = require('./convert');
 const func = convert('dropRightWhile', require('../dropRightWhile'));

func.placeholder = require('./placeholder');
module.exports = func;
