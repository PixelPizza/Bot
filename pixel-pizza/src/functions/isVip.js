'use strict';

const hasRole = require("./hasRole");
const {levelRoles} = require("../data/roles");

const isVip = (member) => hasRole(member, levelRoles.hundered);

module.exports = isVip;