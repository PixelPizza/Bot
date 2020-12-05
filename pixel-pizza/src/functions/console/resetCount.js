'use strict';

/**
 * Resets the count on a label (shorter version of console.countReset)
 * @param {string} label The label to use
 * @returns {void}
 */
const resetCount = label => console.countReset(label);

module.exports = resetCount;