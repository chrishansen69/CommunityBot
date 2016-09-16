'use strict';
const convert = require('./convert');
 const func = convert('methodOf', require('../methodOf'));

func.placeholder = require('./placeholder');
module.exports = func;
