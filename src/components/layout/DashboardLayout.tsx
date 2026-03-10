"use client";

import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-[372px] pt-8 pb-20 px-4 sm:px-6 lg:px-0 lg:pr-14">
        <div className="max-w-[1440px]">
          {children}
        </div>
      </main>
    </div>
  );
}
