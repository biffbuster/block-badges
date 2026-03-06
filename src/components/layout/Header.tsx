"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Settings,
  HelpCircle,
  WalletCards,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePrivy, useLogin, useLogout, useLinkAccount } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Achievements", href: "/achievements" },
  { label: "How It Works", href: "/dashboard/how-it-works" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Community", href: "#faq" },
];

const profileMenuItems = [
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Settings", icon: Settings, href: "#" },
  { label: "Help", icon: HelpCircle, href: "#" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { linkWallet } = useLinkAccount();
  const { address } = useAccount();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [profileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-bg-primary/80 backdrop-blur-xl shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 pt-3 h-16 flex items-center justify-between">
        {/* Logo — left */}
        <Link href={authenticated ? "/dashboard" : "/"} className="flex-1 flex items-center">
          <Image
            src="/logos/block_badges_light.png"
            alt="Block Badges"
            width={400}
            height={160}
            className="h-[140px] w-auto object-contain brightness-[2] contrast-[1.2]"
          />
        </Link>

        {/* Center chrome pill nav */}
        <motion.nav
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="hidden md:flex items-center gap-0.5 px-1.5 py-1 rounded-full relative"
          style={{
            background: "linear-gradient(180deg, rgba(60,60,70,0.9) 0%, rgba(35,35,45,0.95) 100%)",
            boxShadow:
              "0 1px 0 0 rgba(255,255,255,0.07) inset, 0 -1px 0 0 rgba(0,0,0,0.3) inset, 0 4px 16px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Top highlight edge */}
          <div
            className="absolute top-0 left-4 right-4 h-px rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
          />
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-zinc-300 hover:text-white transition-all duration-200 px-5 py-2 rounded-full hover:bg-white/[0.08]"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-zinc-300 hover:text-white transition-all duration-200 px-5 py-2 rounded-full hover:bg-white/[0.08]"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
              >
                {link.label}
              </a>
            )
          )}
          {/* Bottom shadow edge */}
          <div
            className="absolute bottom-0 left-4 right-4 h-px rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)",
            }}
          />
        </motion.nav>

        {/* Right — wallet + profile */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-2">
          {!ready ? null : !authenticated ? (
            <button
              onClick={login}
              className="btn-liquid px-6 py-2.5 text-sm font-bold rounded-full text-white"
            >
              Sign In
            </button>
          ) : (
            <>
              {displayAddress ? (
                <button
                  onClick={() => router.push("/dashboard/profile")}
                  className="btn-liquid px-6 py-2.5 text-sm font-bold rounded-full text-white"
                >
                  {displayAddress}
                </button>
              ) : (
                <span className="px-4 py-2 text-sm text-zinc-400">
                  Signed in
                </span>
              )}

              {/* Profile dropdown trigger */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: profileOpen
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0.06)",
                    border: profileOpen
                      ? "1px solid rgba(255,255,255,0.15)"
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <User className="w-4 h-4 text-zinc-300" />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
                      style={{
                        background: "rgba(14, 14, 28, 0.95)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow:
                          "0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      <div className="p-1.5">
                        {profileMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.label}
                              onClick={() => {
                                setProfileOpen(false);
                                if (item.href !== "#") {
                                  router.push(item.href);
                                }
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                              <Icon className="w-4 h-4 text-zinc-500" />
                              {item.label}
                            </button>
                          );
                        })}

                        {/* Add Wallet */}
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            linkWallet();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <WalletCards className="w-4 h-4 text-zinc-500" />
                          Add Wallet
                        </button>

                        {/* Divider */}
                        <div className="my-1 mx-2 h-px bg-white/[0.06]" />

                        {/* Disconnect */}
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors py-2"
                  >
                    {link.label}
                  </a>
                )
              )}

              {/* Mobile profile links (when authenticated) */}
              {authenticated && (
                <>
                  <div className="my-1 h-px bg-white/[0.06]" />
                  {profileMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors py-2"
                      >
                        <Icon className="w-4 h-4 text-zinc-600" />
                        {item.label}
                      </Link>
                    );
                  })}
                </>
              )}

              <div className="flex flex-col gap-2 mt-2">
                {!ready ? null : !authenticated ? (
                  <button
                    onClick={login}
                    className="px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-accent-orange to-accent-amber text-white w-full"
                  >
                    Sign In
                  </button>
                ) : displayAddress ? (
                  <button
                    onClick={() => router.push("/dashboard/profile")}
                    className="px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-accent-orange to-accent-amber text-white w-full"
                  >
                    {displayAddress}
                  </button>
                ) : (
                  <span className="px-5 py-2.5 text-sm text-zinc-400 text-center">
                    Signed in
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
