# Souve - Project Context

## What is this?
ZK-verified on-chain achievement badges. Users connect wallet, app queries Space and Time's indexed blockchain data, Proof of SQL generates a ZK-SNARK proving the result is correct, and qualified users unlock collectible badge cards. Users flex, protocols reward.

## Tech Stack
- Next.js 14 (App Router, `"type": "module"` in package.json)
- TypeScript (strict)
- Postgres + Prisma
- Space and Time SDK (`sxt-proof-of-sql-sdk`) for off-chain pre-checks
- Viem + Wagmi + Privy (`@privy-io/react-auth` + `@privy-io/wagmi`) for auth & wallet (Base mainnet)
- Base mainnet for SBT minting
- Foundry + SXT Proof of SQL Solidity (soldeer) for on-chain verification
- Tailwind CSS + Framer Motion for UI
- GSAP for scroll-driven animations

## Architecture: On-Chain Verification
The verification is fully on-chain via SXT's Query Router on Base:
1. **Off-chain pre-check**: `useCheckAchievement` → calls server `/api/check-achievement` → SXT SDK (free, fast)
2. **On-chain verify**: `useVerifyBadgeOnChain` → approve SXT → `BadgeVerifier.verifyBadge()` → SXT Query Router → ZK callback → auto-mint SBT
3. **Costs**: ~100 SXT deposit per query (~23 SXT consumed, ~77 refunded)

### Contract Architecture
- `BlockBadge.sol` — Soulbound ERC-721 SBT, minter = BadgeVerifier
- `BadgeVerifier.sol` — Submits queries to SXT Query Router, receives ZK-proven callbacks, mints SBTs
- SXT contracts on Base: Query Router `0x220a...2DbB`, Executor `0xaCf0...e47`, SXT Token `0xE6Bf...195`

## Key Patterns
- All SXT queries go through `/lib/sxt/client.ts` (server-only, lazy singleton)
- SXT SDK is WASM — must be dynamically imported (`await import("sxt-proof-of-sql-sdk")`)
- SXT SDK declared as `serverComponentsExternalPackages` in next.config.mjs
- Proofs stored in DB with achievement unlocks
- API routes in `/app/api/[...]/route.ts`
- Achievement definitions live in `/lib/achievements.ts` with SQL query templates
- Achievement evaluators in `/lib/evaluators.ts` — one evaluator function per badge ID
- SQL templates use `{wallet}` placeholder, replaced server-side before query execution
- SXT result format: `{ COLUMN_NAME: { Int: [val], BigInt: ["val"], VarChar: ["str"] } }`
- On-chain queries use `$1` parameter (wallet address) via ParamsBuilder

## SXT Configuration
- Query endpoint: `https://api.makeinfinite.dev/v1/prove`
- Auth endpoint: `https://proxy.api.makeinfinite.dev/auth/apikey`
- RPC endpoint: `https://rpc.testnet.sxt.network`
- API key stored in `SXT_API_KEY` env var (server-only, never expose to client)
- Main method: `client.queryAndVerify(sql)` — returns verified result with ZK proof
- Table naming: UPPERCASE `NAMESPACE.TABLE_NAME` (e.g., `ETHEREUM.TRANSACTIONS`)
- Supported tables: BLOCKS, TRANSACTIONS, LOGS, ERC20_EVT_TRANSFER, ERC721_EVT_TRANSFER
- Supported chains: Ethereum, Bitcoin, Polygon, Base, Arbitrum, Optimism, ZKsync, Avalanche, Sui, Aptos

## Auth / Chain Config
- Privy for authentication (email, wallet, Google, Twitter login methods)
- Privy app ID in `NEXT_PUBLIC_PRIVY_APP_ID`
- Dark theme with orange accent `#f97316`
- Connected to Base mainnet (chain ID 8453)
- `@privy-io/wagmi` adapter keeps all wagmi hooks (`useAccount`, `useWriteContract`, etc.) working
- Use `useLogout()` from Privy instead of `useDisconnect()` from wagmi
- Dashboard requires correct chain — shows warning if on wrong network
- Users authenticated via email/social may not have a wallet address — check `address` from `useAccount()`

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── check-achievement/route.ts   # POST: off-chain verify via SXT SDK
│   │   ├── mint-badge/route.ts          # POST: server-side SBT mint (legacy)
│   │   ├── sync-events/route.ts         # POST: sync on-chain events to DB
│   │   ├── badges/[wallet]/route.ts     # GET: wallet badges
│   │   ├── profile/[wallet]/route.ts    # GET: profile stats
│   │   └── metadata/[badgeId]/route.ts  # GET: ERC-721 metadata
│   ├── dashboard/
│   │   ├── page.tsx                     # Badge grid (requires wallet + Base)
│   │   ├── card/[cardId]/page.tsx       # Card detail + on-chain verification UX
│   │   └── how-it-works/page.tsx        # Proof of SQL explainer page
│   ├── layout.tsx                       # Root layout with Web3Provider
│   └── page.tsx                         # Landing page
├── components/
│   ├── landing/                         # Hero, Features, HowItWorks, Showcase, FAQ, etc.
│   ├── layout/                          # Header, Footer
│   ├── ui/PrivyLoginButton.tsx          # Reusable Privy sign-in button
│   └── providers/Web3Provider.tsx       # Privy + wagmi + React Query
├── hooks/
│   ├── useCheckAchievement.ts           # Client hook for off-chain pre-check
│   ├── useMintBadge.ts                  # Client hook for server-side minting (legacy)
│   └── useVerifyBadgeOnChain.ts         # Client hook for on-chain SXT verification
├── lib/
│   ├── achievements.ts                  # Badge definitions + SQL templates
│   ├── contract.ts                      # Viem clients, ABIs, addresses
│   ├── evaluators.ts                    # Result evaluation per badge ID
│   ├── db.ts                            # Prisma singleton
│   └── sxt.ts                           # SXT client singleton (server-only)
└── types/
    └── sxt-proof-of-sql-sdk.d.ts        # Type declarations for SXT SDK

contracts/
├── src/
│   ├── BlockBadge.sol                   # Soulbound ERC-721 SBT
│   ├── BadgeVerifier.sol                # On-chain ZK verification via SXT Query Router
│   ├── interfaces/IQueryRouter.sol      # SXT Query Router interface
│   └── libraries/ProofOfSQL.sol         # SXT imports + contract addresses
├── script/
│   ├── Deploy.s.sol                     # BlockBadge-only deploy (legacy)
│   └── DeployBadgeVerifier.s.sol        # Full deploy: BlockBadge + BadgeVerifier
└── foundry.toml                         # Foundry config (solc 0.8.30, soldeer deps)

scripts/
└── generate-query-plans.ts              # Generate hex proof plans for badge queries
```

## Design System
- Dark theme: `--bg-primary: #060611`, `--bg-secondary: #0c0c1d`
- Accent colors: orange `#f97316`, amber `#f59e0b`, blue `#3b82f6`
- Glass morphism: `.glass`, `.glass-strong` utility classes
- Gradient text: `.gradient-text` class
- Liquid button: `.btn-liquid` class
- Card component: `.card-3d` with shimmer effect
- Font: Geist Sans/Mono + Shrikhand display font

## Current Focus
On-chain badge verification via SXT Query Router on Base mainnet.

## Don't
- Use any ORM other than Prisma
- Store private keys anywhere
- Skip ZK proof verification
- Import SXT SDK on the client side (server-only)
- Expose `SXT_API_KEY` to the browser
- Use `"type": "module"` breaking patterns (SDK requires it)
- Commit `.env.local` (already in .gitignore)
