'use strict';
const convert = require('./convert');
 const func = convert('reverse', require('../reverse'));

func.placeholder = require('./placeholder');
module.exports = func;
