'use strict';
const convert = require('./convert');
 const func = convert('parseInt', require('../parseInt'));

func.placeholder = require('./placeholder');
module.exports = func;
