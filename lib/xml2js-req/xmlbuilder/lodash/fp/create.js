'use strict';
const convert = require('./convert');
 const func = convert('create', require('../create'));

func.placeholder = require('./placeholder');
module.exports = func;
