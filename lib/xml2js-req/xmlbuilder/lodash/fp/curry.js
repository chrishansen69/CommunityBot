'use strict';
const convert = require('./convert');
 const func = convert('curry', require('../curry'));

func.placeholder = require('./placeholder');
module.exports = func;
