"use client";

import { AlertTriangle } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-lg border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 items-center justify-center rounded-md bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Access denied</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You don’t have permission to view this page.
          </p>
        </div>
      </div>
    </div>
  );
}

