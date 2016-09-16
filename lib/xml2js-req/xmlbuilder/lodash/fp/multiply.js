'use strict';
const convert = require('./convert');
 const func = convert('multiply', require('../multiply'));

func.placeholder = require('./placeholder');
module.exports = func;
