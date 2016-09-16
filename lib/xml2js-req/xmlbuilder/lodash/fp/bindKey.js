'use strict';
const convert = require('./convert');
 const func = convert('bindKey', require('../bindKey'));

func.placeholder = require('./placeholder');
module.exports = func;
