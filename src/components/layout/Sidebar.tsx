"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
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

export default function Sidebar() {
  const { user, authenticated } = usePrivy();
  const { address } = useAccount();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName =
    user?.google?.name ||
    user?.twitter?.username ||
    user?.email?.address?.split("@")[0] ||
    (address ? truncateAddress(address) : "Anonymous");

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
          fixed top-0 bottom-3 w-[300px] z-50 flex flex-col transition-transform duration-300 ease-in-out
          lg:left-14 lg:translate-x-0
          ${mobileOpen ? "left-0 translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
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
        <div className="px-4 pt-0 pb-1">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <Image
              src="/logos/block_badges_light.png"
              alt="Block Badges"
              width={600}
              height={240}
              className="h-[140px] lg:h-[190px] w-auto object-contain brightness-[2] contrast-[1.2] -mt-4 lg:-mt-6"
            />
          </Link>
        </div>

        {/* Primary nav */}
        <nav className="px-3 mt-0">
          {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 text-zinc-500 hover:text-white hover:bg-white/[0.08]"
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-5 my-4 h-px bg-white/[0.04]" />

        {/* Coming Soon */}
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* User profile */}
        <div className="px-4 pb-5">
          <div className="border-t border-white/[0.04] pt-4 mb-3" />

          {authenticated ? (
            <>
              {/* User info */}
              <Link href="/dashboard/profile" className="flex items-center gap-3 mb-4 group" onClick={() => setMobileOpen(false)}>
                <div className="relative">
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
              </Link>

              {/* Balance rows */}
              <div className="space-y-1.5">
                <div
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
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
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
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
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <Sparkles className="w-4 h-4 text-amber-500/60" />
                  <span className="text-sm font-semibold text-white">0</span>
                  <span className="text-[10px] text-zinc-600">Points</span>
                  <button className="ml-auto w-5 h-5 rounded flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05] transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-zinc-600">Sign in to view profile</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
