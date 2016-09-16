'use strict';
const convert = require('./convert');
 const func = convert('unionBy', require('../unionBy'));

func.placeholder = require('./placeholder');
module.exports = func;
