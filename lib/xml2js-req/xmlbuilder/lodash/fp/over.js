'use strict';
const convert = require('./convert');
 const func = convert('over', require('../over'));

func.placeholder = require('./placeholder');
module.exports = func;
