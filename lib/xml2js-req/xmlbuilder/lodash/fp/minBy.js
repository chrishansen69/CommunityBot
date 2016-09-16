'use strict';
const convert = require('./convert');
 const func = convert('minBy', require('../minBy'));

func.placeholder = require('./placeholder');
module.exports = func;
