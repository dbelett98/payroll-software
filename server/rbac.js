// rbac.js: Role-based access control using open-source CASL.js (free, defines abilities by role).
const { AbilityBuilder, Ability } = require('@casl/ability');  // Free CASL for permissions.

function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);  // Builder for rules (free).

  if (user.role === 'ADMIN' || user.role === 'STAFF') {
    can('manage', 'all');  // Full access for PSB staff (free rule definition).
  } else if (user.role === 'CLIENT') {
    can('read', 'Client', { userId: user.id });  // Clients view own data only.
    can('submit', 'Hours');  // Allow hour submissions (future iteration).
    cannot('manage', 'PayrollRun');  // Restrict sensitive ops.
  }

  return build();  // Returns ability object (free).
}

module.exports = defineAbilitiesFor;