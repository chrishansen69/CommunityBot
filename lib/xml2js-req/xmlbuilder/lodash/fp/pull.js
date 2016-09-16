'use strict';
const convert = require('./convert');
 const func = convert('pull', require('../pull'));

func.placeholder = require('./placeholder');
module.exports = func;
