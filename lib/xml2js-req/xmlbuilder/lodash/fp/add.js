'use strict';
const convert = require('./convert');
 const func = convert('add', require('../add'));

func.placeholder = require('./placeholder');
module.exports = func;
