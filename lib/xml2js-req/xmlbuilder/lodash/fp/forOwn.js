'use strict';
const convert = require('./convert');
 const func = convert('forOwn', require('../forOwn'));

func.placeholder = require('./placeholder');
module.exports = func;
