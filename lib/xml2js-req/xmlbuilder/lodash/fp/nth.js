'use strict';
const convert = require('./convert');
 const func = convert('nth', require('../nth'));

func.placeholder = require('./placeholder');
module.exports = func;
