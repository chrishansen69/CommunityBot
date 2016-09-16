'use strict';
const convert = require('./convert');
 const func = convert('cloneDeep', require('../cloneDeep'), require('./_falseOptions'));

func.placeholder = require('./placeholder');
module.exports = func;
