'use strict';

const hasRole = (member, role) => member.roles.cache.has(role);

module.exports = hasRole;