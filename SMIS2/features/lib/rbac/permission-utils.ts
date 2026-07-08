import type { PermissionKey, UserLike } from "./types";

export function userHasPermission(user: UserLike | null | undefined, required: PermissionKey): boolean {
  if (!user) return false;

  // Primary: permissions[]
  if (Array.isArray(user.permissions)) {
    return user.permissions.includes(required);
  }

  // Fallback: role -> derive a permissions-like behavior if permissions[] missing.
  // This keeps the gating resilient even if auth provider changes.
  // Example convention (optional): role names might match permission keys.
  if (typeof user.role === "string") {
    return user.role === required;
  }

  return false;
}

