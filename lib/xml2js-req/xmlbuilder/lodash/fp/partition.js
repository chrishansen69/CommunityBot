'use strict';
const convert = require('./convert');
 const func = convert('partition', require('../partition'));

func.placeholder = require('./placeholder');
module.exports = func;
