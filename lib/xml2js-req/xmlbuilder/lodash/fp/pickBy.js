'use strict';
const convert = require('./convert');
 const func = convert('pickBy', require('../pickBy'));

func.placeholder = require('./placeholder');
module.exports = func;
