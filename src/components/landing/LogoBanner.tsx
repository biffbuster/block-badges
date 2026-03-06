"use client";

import Image from "next/image";

function PolygonLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 178 162" className={className} fill="#8247E5">
      <path d="M133.3 54.5c-4.1-2.4-9.4-2.4-13.7 0L96.3 68.2l-15.8 8.7L57.8 90.6c-4.1 2.4-9.4 2.4-13.7 0L22.8 77.8c-4.1-2.4-6.9-6.9-6.9-11.8V41.1c0-4.7 2.5-9.4 6.9-11.8l21-12.5c4.1-2.4 9.4-2.4 13.7 0l21 12.5c4.1 2.4 6.9 6.9 6.9 11.8v13.7l15.8-9V31.5c0-4.7-2.5-9.4-6.9-11.8L52.5 0c-4.1-2.4-9.4-2.4-13.7 0L-3.5 19.7C-7.9 22.1-10 26.8-10 31.5v39.5c0 4.7 2.5 9.4 6.9 11.8l42.5 19.7c4.1 2.4 9.4 2.4 13.7 0l22.7-13.4 15.8-9.2 22.7-13.4c4.1-2.4 9.4-2.4 13.7 0l21 12.5c4.1 2.4 6.9 6.9 6.9 11.8v24.9c0 4.7-2.5 9.4-6.9 11.8l-20.7 12.5c-4.1 2.4-9.4 2.4-13.7 0l-21-12.5c-4.1-2.4-6.9-6.9-6.9-11.8v-13.7l-15.8 9.2v13.7c0 4.7 2.5 9.4 6.9 11.8l42.5 19.7c4.1 2.4 9.4 2.4 13.7 0l42.5-19.7c4.1-2.4 6.9-6.9 6.9-11.8V71c0-4.7-2.5-9.4-6.9-11.8L133.3 54.5z" />
    </svg>
  );
}

const logos: {
  name: string;
  type: "image" | "svg";
  src?: string;
  width: string;
  height: string;
  showLabel: boolean;
}[] = [
  { name: "Ethereum", type: "image", src: "/logos/ethereum.png", width: "w-7", height: "h-11", showLabel: true },
  { name: "Polygon", type: "svg", width: "w-8", height: "h-7", showLabel: true },
  { name: "Sui", type: "image", src: "/logos/sui.webp", width: "w-8", height: "h-8", showLabel: true },
  { name: "ZKsync", type: "image", src: "/logos/zksync.png", width: "w-28", height: "h-7", showLabel: false },
  { name: "Space and Time", type: "image", src: "/logos/sxt.svg", width: "w-32", height: "h-9", showLabel: false },
  { name: "Arbitrum", type: "image", src: "/logos/arbitrum.png", width: "w-32", height: "h-8", showLabel: false },
  { name: "Optimism", type: "image", src: "/logos/optimism.webp", width: "w-8", height: "h-8", showLabel: true },
];

function LogoItem({ logo }: { logo: (typeof logos)[0] }) {
  return (
    <div className="inline-flex items-center gap-3 mx-12 flex-shrink-0 opacity-50 hover:opacity-80 transition-opacity">
      {logo.type === "image" ? (
        <Image
          src={logo.src!}
          alt={logo.name}
          width={140}
          height={48}
          className={`${logo.width} ${logo.height} object-contain`}
        />
      ) : (
        <PolygonLogo className={`${logo.width} ${logo.height}`} />
      )}
      {logo.showLabel && (
        <span className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">
          {logo.name}
        </span>
      )}
    </div>
  );
}

export default function LogoBanner() {
  // Duplicate the full set to guarantee seamless wrap
  const items = [...logos, ...logos];

  return (
    <section className="relative py-7 border-y border-white/5 bg-bg-secondary/40 overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

      <div className="flex items-center animate-marquee">
        {items.map((logo, i) => (
          <LogoItem key={`${logo.name}-${i}`} logo={logo} />
        ))}
      </div>
    </section>
  );
}
