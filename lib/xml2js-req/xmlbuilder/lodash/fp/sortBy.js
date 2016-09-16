'use strict';
const convert = require('./convert');
 const func = convert('sortBy', require('../sortBy'));

func.placeholder = require('./placeholder');
module.exports = func;
