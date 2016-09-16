'use strict';
const convert = require('./convert');
 const func = convert('xorBy', require('../xorBy'));

func.placeholder = require('./placeholder');
module.exports = func;
