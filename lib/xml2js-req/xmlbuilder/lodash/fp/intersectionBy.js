'use strict';
const convert = require('./convert');
 const func = convert('intersectionBy', require('../intersectionBy'));

func.placeholder = require('./placeholder');
module.exports = func;
