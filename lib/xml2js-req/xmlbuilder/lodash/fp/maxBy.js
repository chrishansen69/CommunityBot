'use strict';
const convert = require('./convert');
 const func = convert('maxBy', require('../maxBy'));

func.placeholder = require('./placeholder');
module.exports = func;
