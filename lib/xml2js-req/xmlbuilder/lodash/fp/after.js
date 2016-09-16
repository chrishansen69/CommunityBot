'use strict';
const convert = require('./convert');
 const func = convert('after', require('../after'));

func.placeholder = require('./placeholder');
module.exports = func;
