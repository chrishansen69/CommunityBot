'use strict';
const convert = require('./convert');
 const func = convert('fill', require('../fill'));

func.placeholder = require('./placeholder');
module.exports = func;
