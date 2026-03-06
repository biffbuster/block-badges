"use client";

import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[280px] pt-8 pb-20 pl-8 pr-6">
        <div className="max-w-[1440px]">
          {children}
        </div>
      </main>
    </div>
  );
}
