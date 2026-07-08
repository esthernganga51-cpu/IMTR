"use client";

import type { ReactNode } from "react";

import { AccessDenied } from "./AccessDenied";
import type { PermissionKey, UserLike } from "./types";
import { userHasPermission } from "./permission-utils";

type RequirePermissionProps = Readonly<{
  user: UserLike | null;
  permission: PermissionKey;
  children: ReactNode;
}>;

export function RequirePermission({ user, permission, children }: RequirePermissionProps) {
  if (!userHasPermission(user, permission)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}

