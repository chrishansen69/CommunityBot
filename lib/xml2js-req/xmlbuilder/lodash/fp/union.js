'use strict';
const convert = require('./convert');
 const func = convert('union', require('../union'));

func.placeholder = require('./placeholder');
module.exports = func;
