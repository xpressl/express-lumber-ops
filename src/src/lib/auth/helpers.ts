import { getServerSession } from "next-auth";
import { authOptions, type ExtendedSession, type SessionUser } from "./options";

/** Get the current authenticated session or null */
export async function getSession(): Promise<ExtendedSession | null> {
  return (await getServerSession(authOptions)) as ExtendedSession | null;
}

/** Get the current user or null */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/** Require authentication - throws if not authenticated */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("UNAUTHORIZED", "Authentication required");
  }
  return user;
}

/** Require a specific role - throws if missing */
export async function requireRole(allowedRoles: string[]): Promise<SessionUser> {
  const user = await requireAuth();
  const hasRole = user.roles.some((r) => allowedRoles.includes(r) || r === "SUPER_ADMIN");
  if (!hasRole) {
    throw new AuthError("FORBIDDEN", "Insufficient role");
  }
  return user;
}

/** Require a specific permission - throws if missing */
export async function requirePermission(permissionCode: string): Promise<SessionUser> {
  const user = await requireAuth();
  const hasPermission =
    user.roles.includes("SUPER_ADMIN") || user.permissions.includes(permissionCode);
  if (!hasPermission) {
    throw new AuthError("FORBIDDEN", `Missing permission: ${permissionCode}`);
  }
  return user;
}

/** Auth error class with HTTP-friendly code */
export class AuthError extends Error {
  code: "UNAUTHORIZED" | "FORBIDDEN";
  status: number;

  constructor(code: "UNAUTHORIZED" | "FORBIDDEN", message: string) {
    super(message);
    this.code = code;
    this.status = code === "UNAUTHORIZED" ? 401 : 403;
    this.name = "AuthError";
  }
}
