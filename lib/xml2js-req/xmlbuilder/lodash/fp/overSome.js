'use strict';
const convert = require('./convert');
 const func = convert('overSome', require('../overSome'));

func.placeholder = require('./placeholder');
module.exports = func;
