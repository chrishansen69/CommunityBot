'use strict';
const convert = require('./convert');
 const func = convert('keyBy', require('../keyBy'));

func.placeholder = require('./placeholder');
module.exports = func;
