'use strict';
const convert = require('./convert');
 const func = convert('dropWhile', require('../dropWhile'));

func.placeholder = require('./placeholder');
module.exports = func;
