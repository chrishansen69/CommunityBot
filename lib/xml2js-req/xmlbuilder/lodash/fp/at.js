'use strict';
const convert = require('./convert');
 const func = convert('at', require('../at'));

func.placeholder = require('./placeholder');
module.exports = func;
