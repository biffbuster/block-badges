"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import {
  Home,
  LayoutDashboard,
  Activity,
  Trophy,
  Lock,
  Plus,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogIn,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/dashboard", exact: true },
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", exact: true },
  { label: "Activity", icon: Activity, href: "/dashboard/activity", exact: false },
  { label: "Achievements", icon: Trophy, href: "/achievements", exact: false },
];

const comingSoon = [
  { label: "Coming Soon" },
  { label: "Coming Soon" },
  { label: "Coming Soon" },
];

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

interface SidebarProps {
  width?: number;
  onWidthChange?: (width: number) => void;
  onToggle?: () => void;
}

export default function Sidebar({ width = 300, onWidthChange, onToggle }: SidebarProps) {
  const { user, authenticated } = usePrivy();
  const { login } = useLogin();
  const { address } = useAccount();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isCollapsed = width < 120;

  const displayName =
    user?.google?.name ||
    user?.twitter?.username ||
    user?.email?.address?.split("@")[0] ||
    (address ? truncateAddress(address) : "Anonymous");

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      const startX = e.clientX;
      const startWidth = width;

      function handleMove(ev: MouseEvent) {
        const delta = ev.clientX - startX;
        const newWidth = Math.max(68, Math.min(350, startWidth + delta));
        onWidthChange?.(newWidth);
      }

      function handleUp(ev: MouseEvent) {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        // Snap to collapsed or expanded
        const finalDelta = ev.clientX - startX;
        const finalWidth = Math.max(68, Math.min(350, startWidth + finalDelta));
        if (finalWidth < 120) {
          onWidthChange?.(68);
        } else if (finalWidth > 200) {
          onWidthChange?.(300);
        }
      }

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [width, onWidthChange]
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-zinc-400 hover:text-white transition-colors"
        style={{
          background: "rgba(12, 12, 30, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-3 z-50 flex flex-col overflow-hidden
          ${isDragging ? "" : "transition-[width] duration-300 ease-in-out"}
          lg:left-14 lg:translate-x-0
          ${mobileOpen ? "left-0 translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          width: mobileOpen ? 300 : width,
          background: mobileOpen ? "rgba(6, 6, 17, 0.95)" : "transparent",
          backdropFilter: mobileOpen ? "blur(24px)" : "none",
        }}
      >
        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 z-50 lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo */}
        <div className={`${isCollapsed ? "px-2 pt-6 pb-3" : "px-4 pt-0 pb-1"} overflow-hidden`}>
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            {isCollapsed ? (
              <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-accent-orange to-accent-amber flex items-center justify-center text-white font-bold text-xs">
                BB
              </div>
            ) : (
              <Image
                src="/logos/block_badges_light.png"
                alt="Block Badges"
                width={600}
                height={240}
                className="h-[140px] lg:h-[190px] w-auto object-contain brightness-[2] contrast-[1.2] -mt-4 lg:-mt-6"
              />
            )}
          </Link>
        </div>

        {/* Primary nav */}
        <nav className={`${isCollapsed ? "px-1.5" : "px-3"} mt-0`}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center ${isCollapsed ? "justify-center px-0" : "px-4"} gap-3 py-3 rounded-xl mb-1 transition-all duration-200 text-zinc-500 hover:text-white hover:bg-white/[0.08]`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className={`${isCollapsed ? "mx-2" : "mx-5"} my-4 h-px bg-white/[0.04]`} />

        {/* Coming Soon — hidden when collapsed */}
        {!isCollapsed && (
          <nav className="px-3">
            {comingSoon.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-zinc-600 cursor-not-allowed"
              >
                <Lock className="w-[18px] h-[18px]" />
                <span className="text-sm font-medium">{item.label}</span>
                <span
                  className="ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Soon
                </span>
              </div>
            ))}
          </nav>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* User profile */}
        <div className={`${isCollapsed ? "px-2" : "px-4"} pb-5`}>
          {!isCollapsed && <div className="border-t border-white/[0.04] pt-4 mb-3" />}

          {authenticated ? (
            <>
              {/* User info */}
              <Link
                href="/dashboard/profile"
                className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} mb-4 group`}
                onClick={() => setMobileOpen(false)}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #f97316, #f59e0b)",
                    }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0c0c1e]" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-zinc-300 transition-colors">
                      {displayName}
                    </p>
                    {address && (
                      <p className="text-[10px] text-zinc-600 font-mono">
                        {truncateAddress(address)}
                      </p>
                    )}
                  </div>
                )}
              </Link>

              {/* Balance rows — hidden when collapsed */}
              {!isCollapsed && (
                <div className="space-y-1.5">
                  <div
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <Image
                      src="/logos/sxt.svg"
                      alt="SXT"
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain opacity-60"
                    />
                    <span className="text-sm font-semibold text-white">0.00</span>
                    <span className="text-[10px] text-zinc-600">SXT</span>
                    <button className="ml-auto w-5 h-5 rounded flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05] transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <Image
                      src="/logos/ethereum.png"
                      alt="ETH"
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain opacity-60"
                    />
                    <span className="text-sm font-semibold text-white">0.00</span>
                    <span className="text-[10px] text-zinc-600">ETH</span>
                    <button className="ml-auto w-5 h-5 rounded flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05] transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500/60" />
                    <span className="text-sm font-semibold text-white">0</span>
                    <span className="text-[10px] text-zinc-600">Points</span>
                    <button className="ml-auto w-5 h-5 rounded flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05] transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : isCollapsed ? (
            <button
              onClick={login}
              className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-accent-orange to-accent-amber flex items-center justify-center text-white hover:shadow-lg hover:shadow-accent-orange/25 transition-all"
              title="Sign In"
            >
              <LogIn className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-accent-orange to-accent-amber text-white hover:shadow-lg hover:shadow-accent-orange/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>

        {/* Toggle button — desktop only */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="hidden lg:flex absolute top-14 -right-3 w-6 h-6 items-center justify-center rounded-full bg-zinc-900 border border-white/[0.1] text-zinc-500 hover:text-white hover:border-white/25 hover:bg-zinc-800 transition-all z-[60]"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Drag handle — right edge, desktop only */}
        <div
          className="hidden lg:block absolute top-0 bottom-0 -right-1.5 w-3 cursor-col-resize z-[55] group"
          onMouseDown={handleDragStart}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 h-12 rounded-full bg-transparent group-hover:bg-white/20 transition-colors" />
        </div>
      </aside>
    </>
  );
}
