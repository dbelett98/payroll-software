// rbac.js: Role-based access control using open-source CASL.js (free, defines abilities by role from User model in Prisma).
const { AbilityBuilder, Ability } = require('@casl/ability');  // Free CASL for permission rules (zero cost).

function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);  // Builder for defining rules (free CASL feature).

  // Check user role from JWT (integrated with Step D, free).
  if (user.role === 'ADMIN' || user.role === 'STAFF') {
    can('manage', 'all');  // Allow full access for PSB staff/CEO (e.g., input payroll for clients).
  } else if (user.role === 'CLIENT') {
    can('read', 'Client', { userId: user.id });  // Clients can view their own business data only (uses Prisma fields for condition, free).
    can('submit', 'Hours');  // Allow clients to submit employee hours (for future iteration, free rule).
    cannot('manage', 'PayrollRun');  // Prevent clients from processing payroll or taxes (free restriction).
  } else {
    cannot('read', 'all');  // Default deny for unknown roles (free safety net).
  }

  return build();  // Builds and returns the ability object (free, used in middleware).
}

module.exports = defineAbilitiesFor;  // Export for use in routes (free module export).