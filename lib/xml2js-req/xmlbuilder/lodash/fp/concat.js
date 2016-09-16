'use strict';
const convert = require('./convert');
 const func = convert('concat', require('../concat'));

func.placeholder = require('./placeholder');
module.exports = func;
