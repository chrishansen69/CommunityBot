'use strict';
const convert = require('./convert');
 const func = convert('debounce', require('../debounce'));

func.placeholder = require('./placeholder');
module.exports = func;
