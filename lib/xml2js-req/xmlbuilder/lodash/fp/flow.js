'use strict';
const convert = require('./convert');
 const func = convert('flow', require('../flow'));

func.placeholder = require('./placeholder');
module.exports = func;
