'use strict';
const convert = require('./convert');
 const func = convert('updateWith', require('../updateWith'));

func.placeholder = require('./placeholder');
module.exports = func;
