'use strict';
const convert = require('./convert');
 const func = convert('attempt', require('../attempt'));

func.placeholder = require('./placeholder');
module.exports = func;
