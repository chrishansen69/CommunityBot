'use strict';
const convert = require('./convert');
 const func = convert('findFrom', require('../find'));

func.placeholder = require('./placeholder');
module.exports = func;
