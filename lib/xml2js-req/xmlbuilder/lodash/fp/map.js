'use strict';
const convert = require('./convert');
 const func = convert('map', require('../map'));

func.placeholder = require('./placeholder');
module.exports = func;
