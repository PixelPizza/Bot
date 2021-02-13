'use strict';

/**
 * Make a new regex for users
 * @param {string} name The name of the placeholder
 * @returns {RegExp} A regex for users
 */
const makeUserRegex = (name) => new RegExp(`{${name}(?:: *(tag|id|username|name|ping|mention))?}`, "g");

module.exports = makeUserRegex;