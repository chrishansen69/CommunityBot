'use strict';
const convert = require('./convert');
 const func = convert('divide', require('../divide'));

func.placeholder = require('./placeholder');
module.exports = func;
