'use strict';
const convert = require('./convert');
 const func = convert('cloneDeepWith', require('../cloneDeepWith'));

func.placeholder = require('./placeholder');
module.exports = func;
