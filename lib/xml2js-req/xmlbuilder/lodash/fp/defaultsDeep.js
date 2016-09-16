'use strict';
const convert = require('./convert');
 const func = convert('defaultsDeep', require('../defaultsDeep'));

func.placeholder = require('./placeholder');
module.exports = func;
