"use client";

import { Menu, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/features/admin-dashboard/components/ui/button";

type TopbarProps = Readonly<{
  collapsed: boolean;
  onOpenMobile: () => void;
  onToggleCollapsed: () => void;
}>;

export function Topbar({ collapsed, onOpenMobile, onToggleCollapsed }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/86 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-1600px items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          aria-label="Open navigation"
          className="lg:hidden"
          size="icon"
          variant="ghost"
          onClick={onOpenMobile}
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <Button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:inline-flex"
          size="icon"
          variant="ghost"
          onClick={onToggleCollapsed}
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted-foreground">Academic Year 2026</p>
          <h1 className="truncate text-lg font-semibold tracking-normal text-foreground">
            Admin Dashboard
          </h1>
        </div>

        <div className="hidden h-10 w-full max-w-md items-center gap-2 rounded-md border bg-card px-3 shadow-sm md:flex">
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <input
            aria-label="Search admin records"
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search students, invoices, admissions"
            type="search"
          />
        </div>

        <Button size="icon" variant="outline" aria-label="Dashboard filters">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
