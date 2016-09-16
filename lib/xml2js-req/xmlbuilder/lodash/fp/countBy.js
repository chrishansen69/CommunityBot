'use strict';
const convert = require('./convert');
 const func = convert('countBy', require('../countBy'));

func.placeholder = require('./placeholder');
module.exports = func;
