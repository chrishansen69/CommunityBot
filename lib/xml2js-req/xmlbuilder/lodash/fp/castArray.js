'use strict';
const convert = require('./convert');
 const func = convert('castArray', require('../castArray'));

func.placeholder = require('./placeholder');
module.exports = func;
