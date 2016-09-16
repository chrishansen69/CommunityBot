'use strict';
const convert = require('./convert');
 const func = convert('without', require('../without'));

func.placeholder = require('./placeholder');
module.exports = func;
