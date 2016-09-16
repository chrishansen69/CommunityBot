'use strict';
const convert = require('./convert');
 const func = convert('mapKeys', require('../mapKeys'));

func.placeholder = require('./placeholder');
module.exports = func;
