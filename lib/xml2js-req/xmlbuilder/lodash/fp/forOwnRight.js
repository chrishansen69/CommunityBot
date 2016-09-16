'use strict';
const convert = require('./convert');
 const func = convert('forOwnRight', require('../forOwnRight'));

func.placeholder = require('./placeholder');
module.exports = func;
