'use strict';
const convert = require('./convert');
 const func = convert('sumBy', require('../sumBy'));

func.placeholder = require('./placeholder');
module.exports = func;
