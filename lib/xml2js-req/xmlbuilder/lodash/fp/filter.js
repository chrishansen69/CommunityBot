'use strict';
const convert = require('./convert');
 const func = convert('filter', require('../filter'));

func.placeholder = require('./placeholder');
module.exports = func;
