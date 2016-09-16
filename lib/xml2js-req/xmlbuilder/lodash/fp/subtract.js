'use strict';
const convert = require('./convert');
 const func = convert('subtract', require('../subtract'));

func.placeholder = require('./placeholder');
module.exports = func;
