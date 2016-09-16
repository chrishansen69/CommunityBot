'use strict';
const convert = require('./convert');
 const func = convert('overEvery', require('../overEvery'));

func.placeholder = require('./placeholder');
module.exports = func;
