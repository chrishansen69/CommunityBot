'use strict';
const convert = require('./convert');
 const func = convert('rest', require('../rest'));

func.placeholder = require('./placeholder');
module.exports = func;
