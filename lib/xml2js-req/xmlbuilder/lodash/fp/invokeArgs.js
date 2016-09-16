'use strict';
const convert = require('./convert');
 const func = convert('invokeArgs', require('../invoke'));

func.placeholder = require('./placeholder');
module.exports = func;
