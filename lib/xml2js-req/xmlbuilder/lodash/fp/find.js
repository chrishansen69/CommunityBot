'use strict';
const convert = require('./convert');
 const func = convert('find', require('../find'));

func.placeholder = require('./placeholder');
module.exports = func;
