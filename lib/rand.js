'use strict';
module.exports = function(bound) {
  return Math.floor(Math.random() * bound);
};
module.exports.choose = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};
/**
 * javascript port of http://stackoverflow.com/a/8435577 (which is a java port of a javascript script)
 *
 * Example usage:
 * ```js
 * var a = function() {
 *   const values     = [0, 1, 2];
 *   const weightings = [8, 1, 1];
 *   
 *   for (let i = 0; i < 100; i++) {
 *     console.log(module.exports.weightedPick(values, weightings));
 *   }
 * }();
 * ```
 * 
 * @param  {Array<E>} values the values to pick from
 * @param  {Array<Number>} weightings the weighting values
 * @return {E} a value from values
 */
module.exports.weightedPick = function(values, weightings) {

    //determine sum of all weightings
    let total = 0;
    for (let i = 0, il = values.length; i < il; i++) {
        total += weightings[i];
    }

    //select a random value between 0 and our total
    const random = module.exports(total);// new Random().nextInt(total); -- The method call returns a pseudorandom, uniformly distributed int value between 0 (inclusive) and **n (exclusive)**.

    //loop thru our weightings until we arrive at the correct one
    let current = 0;
    for (let i = 0, il = values.length; i < il; i++) {
        current += weightings[i];
        if (random < current)
            return values[i];
    }

    //shouldn't happen.
    return -1;
};