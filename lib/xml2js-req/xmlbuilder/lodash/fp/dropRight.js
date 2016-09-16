'use strict';
const convert = require('./convert');
 const func = convert('dropRight', require('../dropRight'));

func.placeholder = require('./placeholder');
module.exports = func;
