'use strict';
const convert = require('./convert');
 const func = convert('remove', require('../remove'));

func.placeholder = require('./placeholder');
module.exports = func;
