"use client";

import Image from "next/image";

const footerLinks = {
  Product: [
    { label: "Achievements", href: "#showcase" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Leaderboard", href: "#" },
    { label: "FAQ", href: "#faq" },
  ],
  Resources: [
    { label: "SXT Docs", href: "https://docs.spaceandtime.io" },
    { label: "Proof of SQL", href: "https://github.com/spaceandtimefdn/sxt-proof-of-sql-sdk" },
    { label: "API Reference", href: "https://docs.makeinfinite.com" },
    { label: "GitHub", href: "#" },
  ],
  Community: [
    { label: "Discord", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Blog", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center mb-4">
              <Image
                src="/logos/block_badges_light.png"
                alt="Block Badges"
                width={400}
                height={160}
                className="h-[100px] w-auto object-contain brightness-[2] contrast-[1.2]"
              />
            </a>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Collect ZK-verified achievement cards that prove your onchain history. Every badge is backed by cryptographic proof — no trust required.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} Block Badges. All rights reserved.
            </p>
            <span className="hidden sm:block text-zinc-700">·</span>
            <a href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
          <a
            href="https://spaceandtime.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
          >
            <span className="text-xs text-zinc-500">Powered by</span>
            <Image
              src="/logos/sxt.svg"
              alt="Space and Time"
              width={80}
              height={20}
              className="h-4 w-auto object-contain opacity-50 hover:opacity-70 transition-opacity"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
