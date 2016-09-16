'use strict';
const convert = require('./convert');
 const func = convert('zipObjectDeep', require('../zipObjectDeep'));

func.placeholder = require('./placeholder');
module.exports = func;
