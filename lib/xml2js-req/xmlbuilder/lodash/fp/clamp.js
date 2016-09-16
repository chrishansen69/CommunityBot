'use strict';
const convert = require('./convert');
 const func = convert('clamp', require('../clamp'));

func.placeholder = require('./placeholder');
module.exports = func;
