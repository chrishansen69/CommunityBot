'use strict';
const convert = require('./convert');
 const func = convert('mixin', require('../mixin'));

func.placeholder = require('./placeholder');
module.exports = func;
