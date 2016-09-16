'use strict';
module.exports = function(bound) {
  return Math.floor(Math.random() * bound);
};
module.exports.choose = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};