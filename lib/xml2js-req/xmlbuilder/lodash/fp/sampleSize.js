'use strict';
const convert = require('./convert');
 const func = convert('sampleSize', require('../sampleSize'));

func.placeholder = require('./placeholder');
module.exports = func;
