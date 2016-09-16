'use strict';
const convert = require('./convert');
 const func = convert('invoke', require('../invoke'));

func.placeholder = require('./placeholder');
module.exports = func;
