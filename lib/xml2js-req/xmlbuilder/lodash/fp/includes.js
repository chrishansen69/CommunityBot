'use strict';
const convert = require('./convert');
 const func = convert('includes', require('../includes'));

func.placeholder = require('./placeholder');
module.exports = func;
