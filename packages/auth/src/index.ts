export const ADMIN_SESSION_COOKIE = "ractysh_admin_session";

export type AdminRoleName =
  | "Enterprise Owner"
  | "Admin"
  | "Editor"
  | "Operations"
  | "Viewer";

export type ApprovedAdmin = {
  id: string;
  email: string;
  name: string;
  active?: boolean;
  isActive?: boolean;
  roles?: Array<string | { name: string }>;
  role?: string | null;
};

export function isApprovedAdmin(admin: ApprovedAdmin | null | undefined): admin is ApprovedAdmin {
  return Boolean(admin && (admin.active ?? admin.isActive ?? true));
}

export function adminRoleNames(admin: Pick<ApprovedAdmin, "roles" | "role">): string[] {
  const roles = (admin.roles || []).map((role) => (typeof role === "string" ? role : role.name));
  return admin.role ? [...roles, admin.role] : roles;
}

export function hasAdminRole(admin: ApprovedAdmin | null | undefined, allowedRoles: string[]): boolean {
  if (!isApprovedAdmin(admin)) return false;
  if (!allowedRoles.length) return true;
  const roles = adminRoleNames(admin);
  return roles.some((role) => allowedRoles.includes(role));
}
