'use strict';
const convert = require('./convert');
 const func = convert('partialRight', require('../partialRight'));

func.placeholder = require('./placeholder');
module.exports = func;
