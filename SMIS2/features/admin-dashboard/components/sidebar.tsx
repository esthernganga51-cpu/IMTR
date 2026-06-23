"use client";

import {
  Bell,
  ChevronLeft,
  GraduationCap,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { adminNavigationItems } from "@/features/admin-dashboard/data/navigation";
import { Button } from "@/features/admin-dashboard/components/ui/button";
import { cn } from "@/features/admin-dashboard/lib/utils";

type SidebarProps = Readonly<{
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}>;

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar/96 shadow-sm backdrop-blur-xl transition-[width] duration-300 ease-out lg:flex lg:flex-col",
          collapsed ? "w-24" : "w-72",
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          aria-label="Close navigation"
          className={cn(
            "absolute inset-0 bg-foreground/30 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          type="button"
          onClick={onCloseMobile}
        />
        <aside
          className={cn(
            "relative flex h-full w-80 max-w-[88vw] flex-col border-r border-sidebar-border bg-sidebar shadow-xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="absolute right-3 top-3">
            <Button aria-label="Close navigation" size="icon" variant="ghost" onClick={onCloseMobile}>
              <X className="size-5" aria-hidden="true" />
            </Button>
          </div>
          <SidebarContent collapsed={false} onToggleCollapsed={onToggleCollapsed} />
        </aside>
      </div>
    </>
  );
}

type SidebarContentProps = Readonly<{
  collapsed: boolean;
  onToggleCollapsed: () => void;
}>;

function SidebarContent({ collapsed, onToggleCollapsed }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-3 py-4">
      {/* Kept the native GraduationCap icon but maintained your updated branding text */}
      <div className={cn("flex items-center gap-3 px-2", collapsed && "justify-center px-0")}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <GraduationCap className="size-5" aria-hidden="true" />
        </div>
        <div className={cn("min-w-0 flex flex-col", collapsed && "hidden")}>
          <p className="truncate text-xs font-bold uppercase tracking-wider text-sidebar-foreground">IMTR Portal</p>
          <p className="truncate text-[11px] font-medium text-muted-foreground mt-0.5">WMO-RTC Nairobi</p>
        </div>
      </div>

      <nav className="mt-7 flex-1 space-y-1" aria-label="Admin navigation">
        {adminNavigationItems.map((item) => (
          <SidebarLink
            key={`${item.href}::${item.label}`}
            active={isNavigationItemActive(pathname, item.href, item.active)}
            collapsed={collapsed}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border pt-4">
        <a
          href="#"
          className={cn(
            "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Notifications" : undefined}
        >
          <Bell className="size-5" aria-hidden="true" />
          <span className={cn("truncate", collapsed && "sr-only") ?? ""}>Notifications</span>
        </a>
        <a
          href="#"
          className={cn(
            "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="size-5" aria-hidden="true" />
          <span className={cn("truncate", collapsed && "sr-only") ?? ""}>Sign out</span>
        </a>
        <Button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden w-full lg:inline-flex"
          size={collapsed ? "icon" : "sm"}
          variant="outline"
          onClick={onToggleCollapsed}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="size-4" aria-hidden="true" />
              Collapse
              <ChevronLeft className="ml-auto size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function SidebarLink({
  active,
  collapsed,
  href,
  icon: Icon,
  label,
}: Readonly<{
  active: boolean;
  collapsed: boolean;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}>) {
  return (
    <a
      href={href}
      className={cn(
        "group flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active &&
          "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
        collapsed && "justify-center px-0",
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className={cn("truncate", collapsed && "sr-only") ?? ""}>{label}</span>
    </a>
  );
}

function isNavigationItemActive(pathname: string, href: string, fallback?: boolean) {
  if (href === "#") {
    return Boolean(fallback);
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}