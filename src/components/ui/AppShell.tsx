"use client";

import { useState } from "react";
import LogoLoader from "./LogoLoader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <LogoLoader minDuration={2200} onComplete={() => setLoading(false)} />
      <div style={{ visibility: loading ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  );
}
