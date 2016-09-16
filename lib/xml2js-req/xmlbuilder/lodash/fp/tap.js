'use strict';
const convert = require('./convert');
 const func = convert('tap', require('../tap'));

func.placeholder = require('./placeholder');
module.exports = func;
