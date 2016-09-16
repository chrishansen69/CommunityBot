'use strict';
const convert = require('./convert');
 const func = convert('trim', require('../trim'));

func.placeholder = require('./placeholder');
module.exports = func;
