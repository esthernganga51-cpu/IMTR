"use client";

import { createContext, useContext } from "react";

import type { UserLike } from "@/features/lib/rbac/types";

export type UserContextValue = Readonly<{
  user: UserLike | null;
}>;

const UserContext = createContext<UserContextValue>({ user: null });

export function useUserContext() {
  return useContext(UserContext);
}

export function UserContextProvider({
  user,
  children,
}: Readonly<{
  user: UserLike | null;
  children: React.ReactNode;
}>) {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

