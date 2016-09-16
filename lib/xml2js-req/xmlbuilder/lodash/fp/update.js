'use strict';
const convert = require('./convert');
 const func = convert('update', require('../update'));

func.placeholder = require('./placeholder');
module.exports = func;
