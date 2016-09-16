'use strict';
const convert = require('./convert');
 const func = convert('assign', require('../assign'));

func.placeholder = require('./placeholder');
module.exports = func;
