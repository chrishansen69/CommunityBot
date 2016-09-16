'use strict';
const convert = require('./convert');
 const func = convert('takeRight', require('../takeRight'));

func.placeholder = require('./placeholder');
module.exports = func;
