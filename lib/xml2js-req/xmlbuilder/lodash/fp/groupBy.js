'use strict';
const convert = require('./convert');
 const func = convert('groupBy', require('../groupBy'));

func.placeholder = require('./placeholder');
module.exports = func;
