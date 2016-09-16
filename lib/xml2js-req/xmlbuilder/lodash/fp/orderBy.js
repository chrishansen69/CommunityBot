'use strict';
const convert = require('./convert');
 const func = convert('orderBy', require('../orderBy'));

func.placeholder = require('./placeholder');
module.exports = func;
