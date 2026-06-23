"use client";

import type { ReactNode } from "react";

import { Sidebar } from "@/features/admin-dashboard/components/sidebar";
import { Topbar } from "@/features/admin-dashboard/components/topbar";
import { useSidebarState } from "@/features/admin-dashboard/hooks/use-sidebar-state";
import { cn } from "@/features/admin-dashboard/lib/utils";

type AdminShellProps = Readonly<{
  children: ReactNode;
}>;

export function AdminShell({ children }: AdminShellProps) {
  const sidebar = useSidebarState();

  return (
    <div className="min-h-screen text-foreground">
      <Sidebar
        collapsed={sidebar.collapsed}
        mobileOpen={sidebar.mobileOpen}
        onCloseMobile={sidebar.closeMobile}
        onToggleCollapsed={sidebar.toggleCollapsed}
      />
      <div
        className={cn(
          "min-h-screen transition-[padding] duration-300 ease-out lg:pl-72",
          sidebar.collapsed && "lg:pl-24",
        )}
      >
        <Topbar
          collapsed={sidebar.collapsed}
          onOpenMobile={sidebar.openMobile}
          onToggleCollapsed={sidebar.toggleCollapsed}
        />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
