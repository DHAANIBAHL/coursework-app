// Account roles, matching users.role on the server.
export const ROLE_LABELS = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

// Where each role lands after logging in, and where "/" sends them.
// Each role's own area is added as it's built; until then it's the catalog.
const HOME_PATHS = {
  student: "/courses",
  teacher: "/teach",
  admin: "/admin",
};

export function homePathFor(role) {
  return HOME_PATHS[role] ?? "/courses";
}
