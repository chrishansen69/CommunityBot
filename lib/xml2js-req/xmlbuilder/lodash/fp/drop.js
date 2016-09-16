'use strict';
const convert = require('./convert');
 const func = convert('drop', require('../drop'));

func.placeholder = require('./placeholder');
module.exports = func;
