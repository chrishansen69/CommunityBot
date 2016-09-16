'use strict';
const convert = require('./convert');
 const func = convert('restFrom', require('../rest'));

func.placeholder = require('./placeholder');
module.exports = func;
