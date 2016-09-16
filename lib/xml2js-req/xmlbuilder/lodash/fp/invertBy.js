'use strict';
const convert = require('./convert');
 const func = convert('invertBy', require('../invertBy'));

func.placeholder = require('./placeholder');
module.exports = func;
