'use strict';
const convert = require('./convert');
 const func = convert('wrap', require('../wrap'));

func.placeholder = require('./placeholder');
module.exports = func;
