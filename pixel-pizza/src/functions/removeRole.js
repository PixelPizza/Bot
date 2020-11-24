'use strict';

const removeRole = (member, role) => member.roles.remove(role);

module.exports = removeRole;