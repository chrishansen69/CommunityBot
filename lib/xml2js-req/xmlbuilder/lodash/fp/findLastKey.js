'use strict';
const convert = require('./convert');
 const func = convert('findLastKey', require('../findLastKey'));

func.placeholder = require('./placeholder');
module.exports = func;
