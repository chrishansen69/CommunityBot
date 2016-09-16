'use strict';
const convert = require('./convert');
 const func = convert('truncate', require('../truncate'));

func.placeholder = require('./placeholder');
module.exports = func;
