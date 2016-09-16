'use strict';
const convert = require('./convert');
 const func = convert('omitBy', require('../omitBy'));

func.placeholder = require('./placeholder');
module.exports = func;
