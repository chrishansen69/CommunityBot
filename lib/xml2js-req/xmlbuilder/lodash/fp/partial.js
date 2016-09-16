'use strict';
const convert = require('./convert');
 const func = convert('partial', require('../partial'));

func.placeholder = require('./placeholder');
module.exports = func;
