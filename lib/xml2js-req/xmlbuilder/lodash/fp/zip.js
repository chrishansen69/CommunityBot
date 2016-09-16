'use strict';
const convert = require('./convert');
 const func = convert('zip', require('../zip'));

func.placeholder = require('./placeholder');
module.exports = func;
