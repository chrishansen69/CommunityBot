'use strict';
const convert = require('./convert');
 const func = convert('pullAllBy', require('../pullAllBy'));

func.placeholder = require('./placeholder');
module.exports = func;
