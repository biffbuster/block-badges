"use client";

import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(compact ? 68 : 300);

  const handleWidthChange = useCallback((w: number) => {
    setSidebarWidth(w);
  }, []);

  const handleToggle = useCallback(() => {
    setSidebarWidth((w) => (w < 120 ? 300 : 68));
  }, []);

  return (
    <div
      className="dashboard-layout flex min-h-screen"
      style={{ "--sidebar-w": `${sidebarWidth}px` } as React.CSSProperties}
    >
      <Sidebar
        width={sidebarWidth}
        onWidthChange={handleWidthChange}
        onToggle={handleToggle}
      />
      <main className="flex-1 ml-0 pt-8 pb-20 px-4 sm:px-6 lg:px-0 lg:pr-14">
        <div className="max-w-[1440px]">{children}</div>
      </main>
    </div>
  );
}
