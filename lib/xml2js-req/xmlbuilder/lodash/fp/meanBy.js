'use strict';
const convert = require('./convert');
 const func = convert('meanBy', require('../meanBy'));

func.placeholder = require('./placeholder');
module.exports = func;
