'use strict';
const convert = require('./convert');
 const func = convert('intersection', require('../intersection'));

func.placeholder = require('./placeholder');
module.exports = func;
