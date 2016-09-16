'use strict';
const convert = require('./convert');
 const func = convert('differenceBy', require('../differenceBy'));

func.placeholder = require('./placeholder');
module.exports = func;
