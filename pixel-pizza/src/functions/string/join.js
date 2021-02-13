'use strict';

/**
 * Makes a new stirng by joining array values with seperators
 * @param {any[]} array
 * @param {string} seperator The seperator for the array
 * @param {string} endSeperator The last seperator for the array
 * @returns {string} The string with seperators
 */
const join = (array, seperator, endSeperator) => {
    const lastItem = array.pop();
    const joined = `${array.join(seperator)}${endSeperator}${lastItem}`;
    array.push(lastItem);
    return joined;
}

module.exports = join;