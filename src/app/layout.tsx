import type { Metadata } from "next";
import localFont from "next/font/local";
import { Shrikhand } from "next/font/google";
import Web3Provider from "@/components/providers/Web3Provider";
import AppShell from "@/components/ui/AppShell";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const shrikhand = Shrikhand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shrikhand",
});

export const metadata: Metadata = {
  title: "Block Badges | ZK Verified Onchain Collectible Cards",
  description:
    "Collect cryptographically verified achievement cards backed by Space and Time Proof of SQL. Connect your wallet and prove your onchain legacy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${shrikhand.variable} antialiased bg-bg-primary`}
      >
        <Web3Provider>
          <AppShell>
            <div className="cinematic-bg" />
            <div className="cinematic-grain" />
            {children}
          </AppShell>
        </Web3Provider>
      </body>
    </html>
  );
}
