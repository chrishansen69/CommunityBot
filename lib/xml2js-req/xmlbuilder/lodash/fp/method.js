'use strict';
const convert = require('./convert');
 const func = convert('method', require('../method'));

func.placeholder = require('./placeholder');
module.exports = func;
