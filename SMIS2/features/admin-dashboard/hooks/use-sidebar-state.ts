"use client";

import { useCallback, useEffect, useState } from "react";

const SIDEBAR_STORAGE_KEY = "smis-admin-sidebar-collapsed";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);

      if (storedValue !== null) {
        setCollapsed(storedValue === "true");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const nextCollapsed = !current;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextCollapsed));

      return nextCollapsed;
    });
  }, []);

  return {
    closeMobile,
    collapsed,
    mobileOpen,
    openMobile,
    toggleCollapsed,
  };
}
