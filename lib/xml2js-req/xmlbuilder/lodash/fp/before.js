'use strict';
const convert = require('./convert');
 const func = convert('before', require('../before'));

func.placeholder = require('./placeholder');
module.exports = func;
