'use strict';
const convert = require('./convert');
 const func = convert('findKey', require('../findKey'));

func.placeholder = require('./placeholder');
module.exports = func;
