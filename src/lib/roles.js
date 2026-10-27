// Account roles, matching users.role on the server.
export const ROLE_LABELS = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

// Where each role lands after logging in, and where "/" sends them.
const HOME_PATHS = {
  student: "/my-learning",
  teacher: "/teach",
  admin: "/admin",
};

export function homePathFor(role) {
  return HOME_PATHS[role] ?? "/courses";
}
